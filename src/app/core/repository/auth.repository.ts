import {  Injectable } from "@angular/core";
import { BaseRepository } from "./base.repository";
import { Observable } from "rxjs";
import { UserModel } from "@models/user.model";
import { HttpContext } from "@angular/common/http";
import { ApiControllers } from "./ApiControllers";
import { JwtDTO, SubmitCredentialsDTO } from "@models/auth.model";
import { AUTHENTICATE_REQUEST } from "../guards/SecurityConstants";


@Injectable({
    providedIn: 'root',
})
export class AuthRepository extends BaseRepository{

    /**
    * Submit credentials for login 
    * @param credentials the credentials submitted
    * @returns An observable with the JwtDTO
    */
    login(credentials:SubmitCredentialsDTO):Observable<JwtDTO>{
        return this.http.post<JwtDTO>(`${ApiControllers.AUTH}`,credentials,{
            context: new HttpContext().set(AUTHENTICATE_REQUEST, false),
        })
    }

    /**
    * Requests the logged in users info 
    * @returns An observable with the UserModel
    */
    getUserByToken(): Observable<UserModel> {
        return this.http.get<UserModel>(`${ApiControllers.USERS}/account`);
    }

    // getUserOperations(): Observable<OperationModel[]> {
    //     return this.http.get<Operations[]>(`${this.dutEndpoint}/${ApiControllers.USERS}/operations`)
    //         .pipe(
    //             map(response =>{
    //                 const models =response.map(this.operationMapper.mapToModel)
    //                 return models;
    //             })
    //         )
    // }
}