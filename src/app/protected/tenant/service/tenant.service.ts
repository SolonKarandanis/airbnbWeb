import { inject, Injectable } from "@angular/core";
import { GenericService } from "@core/services/generic.service";
import { TenantStore } from "../store/tenant.store";
import { ListingSearchRequest } from "@models/search.model";
import { CategoryName } from "@models/category.model";
import { CreateBooking } from "@models/booking.model";

@Injectable({
    providedIn: 'root'
})
export class TenantService extends GenericService{

    private tenantStore = inject(TenantStore);

    public isLoading = this.tenantStore.loading();
    public searchResults = this.tenantStore.searchResults();
    public totalCount = this.tenantStore.totalCount();
    public selectedListing = this.tenantStore.selectedListing();
    public selectedBooking = this.tenantStore.selectedBooking();
    public availabilityDates = this.tenantStore.availabilityDates();
    public bookedListings = this.tenantStore.bookedListings();

    public executeGetAllListingsByBookingAndCategory(
        category:CategoryName,
        page: number, 
        size: number, 
        sortField?: string, 
        sortOrder?: string
    ):void{
        this.tenantStore.getAllListingsByBookingAndCategory({
            category,
            page,
            size,
            sortField,
            sortOrder
        });
    }

    public executeSearchListings(request:ListingSearchRequest):void{
        this.tenantStore.searchListings(request);
    }

    public executeGetListingById(id:string):void{
        this.tenantStore.getListingById(id);
    }

    public executeCreateBooking(request:CreateBooking):void{
        this.tenantStore.createBooking(request);
    }

    public executeCheckAvailability(listingPublicId:string):void{
        this.tenantStore.checkAvailability(listingPublicId);
    }

    public executeGetTenantBookedListings():void{
        this.tenantStore.getTenantBookedListings();
    }

    public executeGetLandlordBookedListings():void{
        this.tenantStore.getLandlordBookedListings();
    }

    public executeCancelBooking(
        bookingPublicId:string,
        listingPublicId:string,
        byLandlord:boolean
    ):void{
        this.tenantStore.cancelBooking({bookingPublicId,listingPublicId,byLandlord});
    }

}