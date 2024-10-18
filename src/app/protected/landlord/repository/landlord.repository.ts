import { inject, Injectable } from "@angular/core";
import { ApiControllers } from "@core/repository/ApiControllers";
import { BaseRepository } from "@core/repository/base.repository";
import { UtilService } from "@core/services/util.service";
import { CardListing, CreatedListing } from "@models/listing.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LandlordRepository  extends BaseRepository{

    private utilsService = inject(UtilService);

    /**
    * Get all the Card Listings
    * @returns An observable with the CardListings
    */
    public getAllListings():Observable<CardListing[]>{
        return this.http.get<CardListing[]>(`${ApiControllers.LANDLORD}/listings`);
    }

    /**
    * Delete a specific listing
    * @param id The listing's ID
    * @returns An observable that resolves to no data
    */
    public deleteListing(id:string):Observable<void>{
        return this.http.delete<void>(`${ApiControllers.LANDLORD}/listings/${id}`);
    }

    /**
    * Create a new Listing 
    * @param file the file
    * @param dto the dto
    * @returns An observable with the created listing
    */
    public createListing(file: File,dto:string):Observable<CreatedListing>{
        const formData = new FormData();
        formData.append('catalogue', this.utilsService.createJsonBlob(file));
        formData.append('dto', dto);
        return this.http.post<CreatedListing>(`${ApiControllers.LANDLORD}`, formData);
    }
}