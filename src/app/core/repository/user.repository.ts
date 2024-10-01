import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BaseRepository } from "./base.repository";
import { ApiControllers } from "./ApiControllers";

@Injectable({
    providedIn: 'root',
})
export class UserRepository  extends BaseRepository{

    private http = inject(HttpClient);

    private userEndpoint = `${this.airBnbEndpoint}/${ApiControllers.USERS}`;
}