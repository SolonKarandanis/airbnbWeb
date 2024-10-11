import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiControllers } from "@core/repository/ApiControllers";
import { BaseRepository } from "@core/repository/base.repository";


@Injectable({
    providedIn: 'root',
})
export class UserRepository  extends BaseRepository{

    private userEndpoint = `${this.airBnbEndpoint}/${ApiControllers.USERS}`;
}