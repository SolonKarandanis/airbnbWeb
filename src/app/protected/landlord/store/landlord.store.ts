import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit"
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { initialLandlordState, LandlordState } from "./landlord.state";
import { LandlordRepository } from "../repository/landlord.repository";
import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";
import { CardListing } from "@models/listing.model";

export const LandLordStore = signalStore(
    { providedIn: 'root' },
    withDevtools('landlord'),
    withState<LandlordState>(initialLandlordState),
    withComputed((
        {

        }
    )=>({

    })),
    withMethods((state)=>({
        setSearchResults(searchResults:CardListing[]){
            patchState(state,{
                searchResults,
                totalCount:searchResults.length,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setCreatedListingPublicId(createdListingPublicId:string){
            patchState(state,{
                createdListingPublicId,
                loading:false,
                errorMessage:null,
                showError:false
            });
        },
        setLoading(loading:boolean){
            patchState(state,{loading:loading,showError:false});
        },
        setError(error:ErrorResponse){
            patchState(state,{loading:false,showError:true,errorMessage:'Error'});
        }
    })),
    withMethods((
        state,
        landlordRepo = inject(LandlordRepository),
    )=>({
        getAllListings: rxMethod<void>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap(()=> 
                    landlordRepo.getAllListings().pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSearchResults(result)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        deleteListing: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((id)=>
                    landlordRepo.deleteListing(id).pipe(
                        tapResponse({
                            next:()=>{
                                state.setLoading(false)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        createListing: rxMethod<{file:File,dto:string}>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap(({file,dto})=>
                    landlordRepo.createListing(file,dto).pipe(
                        tapResponse({
                            next:({publicId})=>{
                                state.setCreatedListingPublicId(publicId)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
    })),
);