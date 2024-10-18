import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiControllers } from "@core/repository/ApiControllers";
import { BaseRepository } from "@core/repository/base.repository";
import { BookedDates, BookedListing, Booking, CreateBooking } from "@models/booking.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class BookingRepository  extends BaseRepository{

    /**
    * Create a new booking 
    * @param request the request to create a new booking
    * @returns An observable with the created booking
    */
    public createBooking(request:CreateBooking):Observable<Booking>{
        return this.http.post<Booking>(`${ApiControllers.BOOKING}`,request);
    }

    /**
    * Check booking availability 
    * @param listingPublicId the requested listingPublicId
    * @returns An observable with the availability dates
    */
    public checkAvailability(listingPublicId:string):Observable<BookedDates>{
        let queryParams = new HttpParams().append('listingPublicId',listingPublicId);
        return this.http.get<BookedDates>(`${ApiControllers.BOOKING}/check-availability`,{ params: queryParams });
    }

    /**
    * Get the logged in tenants booked listings
    * @returns An observable with the booked listings
    */
    public getTenantBookedListings():Observable<BookedListing[]>{
        return this.http.get<BookedListing[]>(`${ApiControllers.BOOKING}/tenant/booked-listings`);
    }

    /**
    * Get the logged in landlords booked listings
    * @returns An observable with the booked listings
    */
    public getLandlordBookedListings():Observable<BookedListing[]>{
        return this.http.get<BookedListing[]>(`${ApiControllers.BOOKING}/landlord/booked-listings`);
    }

    /**
    * Cancel a booking
    * @param id the id of the user
    * @returns An observable that resolves to no data
    */
    public cancelBooking(
        bookingPublicId:string,
        listingPublicId:string,
        byLandlord:boolean):Observable<void>{
        let queryParams = new HttpParams()
            .append('bookingPublicId',bookingPublicId)
            .append('listingPublicId',listingPublicId)
            .append('byLandlord',byLandlord);
        return this.http.delete<void>(`${ApiControllers.BOOKING}`,{ params: queryParams });
    }
}