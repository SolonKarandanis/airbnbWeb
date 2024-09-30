import { inject, Injectable } from "@angular/core";
import { BaseRepository } from "./base.repository";
import { Observable } from "rxjs";
import { UserModel } from "@models/user.model";
import { HttpClient } from "@angular/common/http";
import { ApiControllers } from "./ApiControllers";
import { JwtDTO, SubmitCredentialsDTO } from "@models/auth.model";

@Injectable({
    providedIn: 'root',
})
export class AuthRepository extends BaseRepository{

    private http = inject(HttpClient);

    // login(credentials:SubmitCredentialsDTO):Observable<JwtDTO>{
    //     return this.http.post<JwtDTO>()
    // }

    getUserByToken(): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.airBnbEndpoint}/${ApiControllers.USERS}/account`);
    }
}