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


    public searchUsers(request:UserSearchRequest):Observable<SearchResult<UserModel>>{
        return this.http
            .post<SearchResult<UserModel>>(`${ApiControllers.USERS}/search`,request);
    }

    public getUserById(id:string):Observable<UserModel>{
        return this.http.get<UserModel>(`${ApiControllers.USERS}/${id}`);
    }

    public registerUser(request:CreateUserRequest):Observable<UserModel>{
        return this.http.post<UserModel>(`${ApiControllers.USERS}`,request);
    }

    public updateUser(id:string,request:UpdateUserRequest):Observable<UserModel>{
        return this.http.put<UserModel>(`${ApiControllers.USERS}/${id}`,request);
    }

    public deleteUser(id:string):Observable<void>{
        return this.http.delete<void>(`${ApiControllers.USERS}/${id}`);
    }

    public activateUser(id:string):Observable<UserModel>{
        return this.http.put<UserModel>(`${ApiControllers.USERS}/${id}/activate`,{});
    }

    public deactivateUser(id:string):Observable<UserModel>{
        return this.http.put<UserModel>(`${ApiControllers.USERS}/${id}/deactivate`,{});
    }
}