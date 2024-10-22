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

// uploadCatalogue(contractId: number, catalogueFileType: string, catalogue: Catalogue, catalogueFile: File, zipFile: File | null): Observable<number> {
//     const formData = new FormData();
//     formData.append('catalogue', this.utilsService.createJsonBlob(catalogue));
//     formData.append('catalogueFile', catalogueFile, catalogueFile.name);
//     if (zipFile) {
//         formData.append('zipFile', zipFile, zipFile.name);
//     }

//     let params: HttpParams = new HttpParams();
//     params = params.append('contractId', contractId).append('catalogueFileType', catalogueFileType);

//     return this.http.post<number>(`${ApiControllers.CATALOGUES}`, formData, { params });
// }

/**
     * Get a downloadable file associated with the specified catalogue's history
     * @param catalogueId The catalogue's ID
     * @param fileType The type of the file to be downloaded or exported
     * @param params HTTP params that should be sent with the request
     * @param reqBody The body of the request
     * @returns An observable that resolves to an ArrayBuffer with the file's data
     */
// getCatalogueFiles(catalogueId: number, fileType: CatalogueFilesApiControllers, params?: HttpParams, reqBody?: GenerateReportRequest): Observable<HttpResponse<ArrayBuffer>> {
//     const tmpParams: HttpParams = params ?? new HttpParams();

//     if (fileType === CatalogueFilesApiControllers.HISTORY_REPORTS) {
//         return this.http.post(`${ApiControllers.CATALOGUES}/${catalogueId}/${fileType}`, reqBody, {
//             responseType: 'arraybuffer',
//             observe: 'response',
//             params: tmpParams,
//         });
//     } else {
//         return this.http.get(`${ApiControllers.CATALOGUES}/${catalogueId}/${fileType}`, {
//             responseType: 'arraybuffer',
//             observe: 'response',
//             params: tmpParams,
//         });
//     }
// }