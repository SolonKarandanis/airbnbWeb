import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
// import {withDevtools} from "@angular-architects/ngrx-toolkit"
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { initialLandlordState, LandlordState } from "./landlord.state";
import { LandlordRepository } from "../repository/landlord.repository";
import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";
import { CardListing, NewListing } from "@models/listing.model";
import { NewListingPicture } from "@models/picture.model";
import { UtilService } from "@core/services/util.service";

export const LandLordStore = signalStore(
    { providedIn: 'root' },
    // withDevtools('landlord'),
    withState<LandlordState>(initialLandlordState),
    withProps(()=>({
        landlordRepo:inject(LandlordRepository),
        utilService:inject(UtilService),
    })),
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
        },
        resetCreatedListingPublicId(){
            patchState(state,{createdListingPublicId:null});
        }
    })),
    withMethods((state)=>{
        const {landlordRepo, utilService} = state;
        return ({
            getAllListings: rxMethod<void>(
                pipe(
                    tap(() => {
                        state.setLoading(true);
                    }),
                    switchMap(()=> 
                        landlordRepo.getAllListings().pipe(
                            tapResponse({
                                next:(result)=>{
                                    state.setSearchResults(result);
                                },
                                error: (error:ErrorResponse) =>{
                                    state.setError(error);
                                }
                            })
                        )
                    )
                )
            ),
            deleteListing: rxMethod<string>(
                pipe(
                    tap(() => {
                        state.setLoading(true);
                    }),
                    switchMap((id)=>
                        landlordRepo.deleteListing(id).pipe(
                            tapResponse({
                                next:(result)=>{
                                    state.setSearchResults(result);
                                    utilService.showMessage('success','Listing Successfully Deleted');
                                },
                                error: (error:ErrorResponse) =>{
                                    state.setError(error);
                                    utilService.showMessage('error',"Couldn't delete listing");
                                }
                            })
                        )
                    )
                )
            ),
            createListing: rxMethod<{pictures: NewListingPicture[],newListing:NewListing}>(
                pipe(
                    tap(() => {
                        state.resetCreatedListingPublicId();
                        state.setLoading(true)
                    }),
                    switchMap(({pictures,newListing})=>
                        landlordRepo.createListing(pictures,newListing).pipe(
                            tapResponse({
                                next:({publicId})=>{
                                    state.setCreatedListingPublicId(publicId);
                                    utilService.showMessage('success','Listing Created Successfully');
                                },
                                error: (error:ErrorResponse) =>{
                                    state.setError(error);
                                    utilService.showMessage('error',"Couldn't create your listing, please try again.");
                                }
                            })
                        )
                    )
                )
            ),
        })
    }),
);