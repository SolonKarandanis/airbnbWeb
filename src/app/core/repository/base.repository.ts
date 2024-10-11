import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "src/environments/environment";

export class BaseRepository{
    private readonly _airBnbEndpoint = `http://${environment.airbnbDomain}`;

    private _http = inject(HttpClient);

    public get airBnbEndpoint(): string{
        return this._airBnbEndpoint;
    }

    public get http():HttpClient{
        return this._http;
    }
}