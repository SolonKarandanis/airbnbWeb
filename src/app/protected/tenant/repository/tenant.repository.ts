import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiControllers } from "@core/repository/ApiControllers";
import { BaseRepository } from "@core/repository/base.repository";
import { CategoryName } from "@models/category.model";
import { CardListing, Listing } from "@models/listing.model";
import { ListingSearchRequest, Paging, SearchResult } from "@models/search.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class TenantRepository  extends BaseRepository{

    /**
    * Get the Listings by category
    * @param category the category of the listing
    * @param pageRequest the page request
    * @returns An Observable of the list of listings found
    */
    public getAllListingsByBookingAndCategory(
        category:CategoryName,
        pageRequest:Paging
    ):Observable<SearchResult<CardListing>>{
        const {limit,page,sortDirection,sortField} = pageRequest;
        let queryParams = new HttpParams()
            .append('category', category)
            .append('page', page)
            .append('size', limit);

        if (sortField && sortDirection) {
            queryParams = queryParams.append('sortField', sortField).append('sortOrder', sortDirection);
        }
        return this.http.get<SearchResult<CardListing>>(`${ApiControllers.TENANT}/listing/by-category`, { params: queryParams });
    }

    /**
    * Search for listings
    * @param request The search criteria
    * @returns An observable with a list of listings found
    */
    public searchListings(request:ListingSearchRequest):Observable<SearchResult<CardListing>>{
        return this.http.post<SearchResult<CardListing>>(`${ApiControllers.TENANT}/listing/search`,request);
    }

    /**
    * Get the details of a specific listing
    * @param id the id of the listing
    * @returns An Observable with the details of the listing
    */
     public getListingById(id:string):Observable<Listing>{
        return this.http.get<Listing>(`${ApiControllers.TENANT}/listing/${id}`);
    }
}