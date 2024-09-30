import { Observable } from "rxjs";
import { BaseRepository } from "./base.repository";
import { HttpResponse } from "@angular/common/http";

export abstract class FilesRepository extends BaseRepository{

    /**
     * Get the data of a file from the backend for downloading
     * @param fileid The file's ID
     * @returns An observable with the file's data in ArrayBuffer
     */
    abstract downloadFile(fileid: number): Observable<HttpResponse<ArrayBuffer>>
    
}