import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "src/environments/environment";

export class BaseRepository{

    private _http = inject(HttpClient);

    public get http():HttpClient{
        return this._http;
    }
}