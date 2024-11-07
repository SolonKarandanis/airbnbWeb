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
import { ListingSearchRequest, Paging } from "@models/search.model";
import { BookedDates, BookedListing, Booking, CreateBooking } from "@models/booking.model";
import { CardListing, Listing } from "@models/listing.model";

export const TenantStore = signalStore(
    { providedIn: 'root' },
    withDevtools('tenant'),
    withState<TenantState>(initialTenantState),
    withComputed(({

    })=>({

    })),
    withMethods((state)=>({
        setSearchResults(searchResults:CardListing[],totalCount:number){
            patchState(state,{
                searchResults,
                totalCount,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setSelectedListing(selectedListing:Listing| null,currentPublicId: string | null){
            patchState(state,{
                selectedListing,
                currentPublicId,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setSelectedBooking(selectedBooking:Booking| null){
            patchState(state,{
                selectedBooking,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setBookedListings(bookedListings:BookedListing[]){
            patchState(state,{
                bookedListings,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setAvailabilityDates(availabilityDates:BookedDates){
            patchState(state,{
                availabilityDates,
                errorMessage:null,
                showError:false,
                loading:false
            })
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
        tenantRepo = inject(TenantRepository),
        bookingRepo = inject(BookingRepository),
    )=>({
        getAllListingsByBookingAndCategory: rxMethod<{
            category:CategoryName, 
            pageRequest:Paging
        }>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap(({category,pageRequest})=> 
                    tenantRepo.getAllListingsByBookingAndCategory(category,pageRequest).pipe(
                        tapResponse({
                            next:({countRows,list})=>{
                                state.setSearchResults(list,countRows);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        searchListings: rxMethod<ListingSearchRequest>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap((request)=> 
                    tenantRepo.searchListings(request).pipe(
                        tapResponse({
                            next:({countRows,list})=>{
                                state.setSearchResults(list,countRows);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        getListingById: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap((id)=> 
                    tenantRepo.getListingById(id).pipe(
                        tapResponse({
                            next:(result)=>{
                               state.setSelectedListing(result,id);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        createBooking: rxMethod<CreateBooking>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap((request)=> 
                    bookingRepo.createBooking(request).pipe(
                        tapResponse({
                            next:(result)=>{
                               state.setSelectedBooking(result);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        checkAvailability: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap((id)=> 
                    bookingRepo.checkAvailability(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setAvailabilityDates(result);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        getTenantBookedListings: rxMethod<void>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap(()=> 
                    bookingRepo.getTenantBookedListings().pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setBookedListings(result);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        getLandlordBookedListings: rxMethod<void>(
            pipe(
                tap(() => {
                    state.setLoading(true);
                }),
                switchMap(()=> 
                    bookingRepo.getLandlordBookedListings().pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setBookedListings(result);
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
        cancelBooking:rxMethod<{bookingPublicId:string,listingPublicId:string,byLandlord:boolean}>(
            pipe(
                tap(() => {
                    state.setLoading(true);
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
                                state.setError(error);
                            }
                        })
                    )
                )
            )
        ),
    })),
);