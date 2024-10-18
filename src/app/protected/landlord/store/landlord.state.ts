import { CardListing, Listing } from "@models/listing.model";

export type LandlordState ={
    readonly loading: boolean,
    readonly errorMessage: string| null;
    readonly showError: boolean;
    readonly selectedListing: Listing| null;
    readonly searchResults: CardListing[];
    readonly totalCount:number| null;
    readonly createdListingPublicId:string| null;
}

export const initialLandlordState: LandlordState = {
    loading: false,
    errorMessage:null,
    showError:false,
    selectedListing: null,
    searchResults: [],
    totalCount: null,
    createdListingPublicId:null
};