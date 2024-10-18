import { inject, Injectable } from "@angular/core";
import { GenericService } from "@core/services/generic.service";
import { LandLordStore } from "../store/landlord.store";

@Injectable({
    providedIn: 'root'
})
export class LandlordService extends GenericService{

    private landlordStore = inject(LandLordStore);

    public isLoading = this.landlordStore.loading();
    public selectedListing = this.landlordStore.selectedListing();
    public searchResults = this.landlordStore.searchResults();
    public totalCount = this.landlordStore.totalCount();

    /**
    * Get all the Card Listings
    * @returns nothing
    */
    public executeGetAllListings():void{
        this.landlordStore.getAllListings();
    }

    /**
    * Delete a specific listing
    * @param id The listing's ID
    * @returns nothing
    */
    public executeDeleteListing(id:string):void{
        this.landlordStore.deleteListing(id);
    }

    /**
    * Create a new Listing 
    * @param file the file
    * @param dto the dto
    * @returns nothing
    */
    public executeCreateListing(file: File,dto:string):void{
        this.landlordStore.createListing({file,dto});
    }
}