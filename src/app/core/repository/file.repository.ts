import { Observable } from "rxjs";
import { BaseRepository } from "./base.repository";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiControllers } from "./ApiControllers";
import { HttpUtil } from "../services/http-util.service";

@Injectable({
    providedIn: 'root'
})
export class FilesRepository extends BaseRepository{

    private filesEndpoint = `${this.airBnbEndpoint}/${ApiControllers.FILES}`;

    private http= inject(HttpClient);
    private httpUtil= inject(HttpUtil);

    /**
     * Get the data of a file from the backend for downloading
     * @param fileid The file's ID
     * @returns An observable with the file's data in ArrayBuffer
     */
   
    
    downloadFile(fileid: number): Observable<HttpResponse<ArrayBuffer>> {
        return this.http.get(`${this.filesEndpoint}/${fileid}`, {
            responseType: 'arraybuffer',
            observe: 'response',
        });
    }

    // downloadFile(fileid: number): Observable<GenericFile> {
    //     return this.filesController.downloadFile(fileid).pipe(
    //         map((responseData: HttpResponse<ArrayBuffer>) => ({
    //             filename: this.httpUtil.getFileNameForContentDisposition(responseData.headers),
    //             id: fileid,
    //             mimeType: responseData.headers.get('Content-Type')!,
    //             arrayBuffer: responseData.body!,
    //         }))
    //     );
    // }
    
}