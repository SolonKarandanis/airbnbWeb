import { BookedDates, BookedListing, Booking } from "@models/booking.model";
import { CardListing, Listing } from "@models/listing.model";

export type TenantState ={
    readonly loading: boolean,
    readonly errorMessage: string| null;
    readonly showError: boolean;
    readonly searchResults: CardListing[];
    readonly totalCount:number| null;
    readonly selectedListing:Listing | null;
    readonly selectedBooking: Booking | null;
    readonly availabilityDates: BookedDates | null;
    readonly bookedListings: BookedListing[];
}

export const initialTenantState: TenantState = {
    loading: false,
    errorMessage:null,
    showError:false,
    searchResults: [],
    totalCount: null,
    selectedListing:null,
    selectedBooking: null,
    availabilityDates: null,
    bookedListings: []
};