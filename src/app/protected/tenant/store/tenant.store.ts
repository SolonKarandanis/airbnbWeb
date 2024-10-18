import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit"
import {initialTenantState,TenantState } from "./tenant.state"
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";
import { TenantRepository } from "../repository/tenant.repository";
import { BookingRepository } from "../repository/booking.repository";
import { CategoryName } from "@models/category.model";
import { ListingSearchRequest } from "@models/search.model";
import { CreateBooking } from "@models/booking.model";

export const TenantStore = signalStore(
    { providedIn: 'root' },
    withDevtools('tenant'),
    withState<TenantState>(initialTenantState),
    withComputed(({

    })=>({

    })),
    withMethods((
        state,
        tenantRepo = inject(TenantRepository),
        bookingRepo = inject(BookingRepository),
    )=>({
        getAllListingsByBookingAndCategory: rxMethod<{
            category:CategoryName, 
            page: number,
            size: number,
            sortField?: string,
            sortOrder?: string
        }>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(({category,page,size,sortField,sortOrder})=> 
                    tenantRepo.getAllListingsByBookingAndCategory(category,page,size,sortField,sortOrder).pipe(
                        tapResponse({
                            next:({countRows,list})=>{
                                patchState(state,{
                                    searchResults: list,
                                    totalCount:countRows,
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
        searchListings: rxMethod<ListingSearchRequest>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((request)=> 
                    tenantRepo.searchListings(request).pipe(
                        tapResponse({
                            next:({countRows,list})=>{
                                patchState(state,{
                                    searchResults: list,
                                    totalCount:countRows,
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
        getListingById: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=> 
                    tenantRepo.getListingById(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedListing:result,
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
        createBooking: rxMethod<CreateBooking>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((request)=> 
                    bookingRepo.createBooking(request).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedBooking: result,
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
        checkAvailability: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=> 
                    bookingRepo.checkAvailability(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    availabilityDates:result,
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
        getTenantBookedListings: rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(()=> 
                    bookingRepo.getTenantBookedListings().pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    bookedListings:result,
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
        getLandlordBookedListings: rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(()=> 
                    bookingRepo.getLandlordBookedListings().pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    bookedListings:result,
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
        cancelBooking:rxMethod<{bookingPublicId:string,listingPublicId:string,byLandlord:boolean}>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(({bookingPublicId,byLandlord,listingPublicId})=> 
                    bookingRepo.cancelBooking(bookingPublicId,listingPublicId,byLandlord).pipe(
                        tapResponse({
                            next:()=>{
                                patchState(state,{
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
    })),
);