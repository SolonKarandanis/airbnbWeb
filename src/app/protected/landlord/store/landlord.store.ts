import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit"
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { initialLandlordState, LandlordState } from "./landlord.state";
import { LandlordRepository } from "../repository/landlord.repository";
import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";

export const LandLordStore = signalStore(
    { providedIn: 'root' },
    withDevtools('landlord'),
    withState<LandlordState>(initialLandlordState),
    withComputed((
        {

        }
    )=>({

    })),
    withMethods((
        state,
        landlordRepo = inject(LandlordRepository),
    )=>({
        getAllListings: rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(()=> 
                    landlordRepo.getAllListings().pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    searchResults:result,
                                    totalCount: result.length,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        deleteListing: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=>
                    landlordRepo.deleteListing(id).pipe(
                        tapResponse({
                            next:()=>{
                                patchState(state,{
                                    loading:false,
                                    errorMessage:null,
                                    showError:false
                                });
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        createListing: rxMethod<{file:File,dto:string}>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(({file,dto})=>
                    landlordRepo.createListing(file,dto).pipe(
                        tapResponse({
                            next:({publicId})=>{
                                patchState(state,{
                                    createdListingPublicId:publicId,
                                    loading:false,
                                    errorMessage:null,
                                    showError:false
                                });
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
    })),
);