import { Injectable } from "@angular/core";
import { ApiControllers } from "@core/repository/ApiControllers";
import { BaseRepository } from "@core/repository/base.repository";
import { SearchResult, UserSearchRequest } from "@models/search.model";
import { CreateUserRequest, UpdateUserRequest, UserModel } from "@models/user.model";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class UserRepository  extends BaseRepository{

    private userEndpoint = `${this.airBnbEndpoint}/${ApiControllers.USERS}`;

    searchUsers(request:UserSearchRequest):Observable<SearchResult<UserModel>>{
        return this.http
            .post<SearchResult<UserModel>>(`${this.userEndpoint}/search`,request);
    }

    getUserById(id:string):Observable<UserModel>{
        return this.http.get<UserModel>(`${this.userEndpoint}/${id}`);
    }

    registerUser(request:CreateUserRequest):Observable<UserModel>{
        return this.http.post<UserModel>(`${this.userEndpoint}`,request);
    }

    updateUser(id:string,request:UpdateUserRequest):Observable<UserModel>{
        return this.http.put<UserModel>(`${this.userEndpoint}/${id}`,request);
    }

    deleteUser(id:string):Observable<void>{
        return this.http.delete<void>(`${this.userEndpoint}/${id}`);
    }
}