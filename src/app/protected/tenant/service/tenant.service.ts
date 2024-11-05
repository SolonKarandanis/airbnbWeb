import { inject, Injectable } from "@angular/core";
import { GenericService } from "@core/services/generic.service";
import { TenantStore } from "../store/tenant.store";
import { ListingSearchRequest, Paging } from "@models/search.model";
import { CategoryName } from "@models/category.model";
import { CreateBooking } from "@models/booking.model";

@Injectable({
    providedIn: 'root'
})
export class TenantService extends GenericService{

    private tenantStore = inject(TenantStore);

    public isLoading = this.tenantStore.loading;
    public searchResults = this.tenantStore.searchResults;
    public totalCount = this.tenantStore.totalCount;
    public selectedListing = this.tenantStore.selectedListing;
    public selectedBooking = this.tenantStore.selectedBooking;
    public availabilityDates = this.tenantStore.availabilityDates;
    public bookedListings = this.tenantStore.bookedListings;

    /**
    * Get the Listings by category
    * @param category the category of the listing
    * @param pageRequest the page request
    * @returns nothing
    */
    public executeGetAllListingsByBookingAndCategory(
        category:CategoryName,
        pageRequest:Paging
    ):void{
        this.tenantStore.getAllListingsByBookingAndCategory({
            category,
            pageRequest
        });
    }

    /**
    * Search for listings
    * @param request The search criteria
    * @returns nothing
    */
    public executeSearchListings(request:ListingSearchRequest):void{
        this.tenantStore.searchListings(request);
    }

    /**
    * Get the details of a specific listing
    * @param id the id of the listing
    * @returns nothing
    */
    public executeGetListingById(id:string):void{
        this.tenantStore.getListingById(id);
    }

    /**
    * Create a new booking 
    * @param request the request to create a new booking
    * @returns nothing
    */
    public executeCreateBooking(request:CreateBooking):void{
        this.tenantStore.createBooking(request);
    }

    /**
    * Check booking availability 
    * @param listingPublicId the requested listingPublicId
    * @returns nothing
    */
    public executeCheckAvailability(listingPublicId:string):void{
        this.tenantStore.checkAvailability(listingPublicId);
    }

    /**
    * Get the logged in tenants booked listings
    * @returns nothing
    */
    public executeGetTenantBookedListings():void{
        this.tenantStore.getTenantBookedListings();
    }

    /**
    * Get the logged in landlords booked listings
    * @returns nothing
    */
    public executeGetLandlordBookedListings():void{
        this.tenantStore.getLandlordBookedListings();
    }

    /**
    * Cancel a booking
    * @param bookingPublicId bookingPublicId
    * @param listingPublicId listingPublicId
    * @param byLandlord byLandlord
    * @returns nothing
    */
    public executeCancelBooking(
        bookingPublicId:string,
        listingPublicId:string,
        byLandlord:boolean
    ):void{
        this.tenantStore.cancelBooking({bookingPublicId,listingPublicId,byLandlord});
    }

}