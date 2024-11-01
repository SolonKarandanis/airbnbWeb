import { inject, Injectable } from "@angular/core";
import { GenericService } from "@core/services/generic.service";
import { LandLordStore } from "../store/landlord.store";
import { NewListingPicture } from "@models/picture.model";
import { NewListing } from "@models/listing.model";
import { Step } from "@landlord/create-property/step.model";

@Injectable({
    providedIn: 'root'
})
export class LandlordService extends GenericService{

    CATEGORY = "category";
    LOCATION = "location";
    INFO = "info";
    PHOTOS = "photos";
    DESCRIPTION = "description";
    PRICE = "price";

    private landlordStore = inject(LandLordStore);

    public isLoading = this.landlordStore.loading;
    public selectedListing = this.landlordStore.selectedListing;
    public searchResults = this.landlordStore.searchResults;
    public totalCount = this.landlordStore.totalCount;
    public createdListingPublicId = this.landlordStore.createdListingPublicId;

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
    * @param pictures the pictures of the listing
    * @param newListing the newListing
    * @returns nothing
    */
    public executeCreateListing(pictures: NewListingPicture[],newListing:NewListing):void{
        this.landlordStore.createListing({pictures,newListing});
    }

    public initializeSteps():Step[]{
        const steps= [
            {
              id: this.CATEGORY,
              idNext: this.LOCATION,
              idPrevious: null,
              isValid: false
            },
            {
              id: this.LOCATION,
              idNext: this.INFO,
              idPrevious: this.CATEGORY,
              isValid: false
            },
            {
              id: this.INFO,
              idNext: this.PHOTOS,
              idPrevious: this.LOCATION,
              isValid: false
            },
            {
              id: this.PHOTOS,
              idNext: this.DESCRIPTION,
              idPrevious: this.INFO,
              isValid: false
            },
            {
              id: this.DESCRIPTION,
              idNext: this.PRICE,
              idPrevious: this.PHOTOS,
              isValid: false
            },
            {
              id: this.PRICE,
              idNext: null,
              idPrevious: this.DESCRIPTION,
              isValid: false
            }
          ];
        return steps;
    }
}


/**
     * Get the history APUC file of the specified catalogue's history
     * @param catalogueId The catalogue's ID
     * @param catalogueHistoryId The catalogue's history's ID
     * @returns An observable that resolves to an ArrayBuffer with the file's data
     */
// getCatalogueHistoryApuc(catalogueId: number, catalogueHistoryId: number): Observable<GenericFile> {
//   return this.cataloguesController.getCatalogueHistoryApuc(catalogueId, catalogueHistoryId).pipe(
//       map((responseData: HttpResponse<ArrayBuffer>) => ({
//           filename: this.httpUtil.getFileNameForContentDisposition(responseData.headers),
//           mimeType: responseData.headers.get('Content-Type')!,
//           arrayBuffer: responseData.body!,
//           id: 0, // Just a random number...
//       }))
//   );
// }