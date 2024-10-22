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


    /**
    * Search for users
    * @param request The search criteria
    * @returns An observable with a list of users found
    */
    public searchUsers(request:UserSearchRequest):Observable<SearchResult<UserModel>>{
        return this.http
            .post<SearchResult<UserModel>>(`${ApiControllers.USERS}/search`,request);
    }

    /**
    * Get the details of a specific user
    * @param id the id of the user
    * @returns An Observable with the details of the user
    */
    public getUserById(id:string):Observable<UserModel>{
        return this.http.get<UserModel>(`${ApiControllers.USERS}/${id}`);
    }

    /**
    * Register a new user
    * @param request the request for creating a new user
    * @returns An Observable with the created user
    */
    public registerUser(request:CreateUserRequest):Observable<UserModel>{
        return this.http.post<UserModel>(`${ApiControllers.USERS}`,request);
    }

    /**
    * Update a selected user
    * @param id the id of the user
    * @param request the request for updating user
    * @returns An Observable with the updated user
    */
    public updateUser(id:string,request:UpdateUserRequest):Observable<UserModel>{
        return this.http.put<UserModel>(`${ApiControllers.USERS}/${id}`,request);
    }

    /**
    * Delete a  user
    * @param id the id of the user
    * @returns An observable that resolves to no data
    */
    public deleteUser(id:string):Observable<void>{
        return this.http.delete<void>(`${ApiControllers.USERS}/${id}`);
    }

    /**
    * Activate a  user
    * @param id the id of the user
    * @returns An observable with the activated user
    */
    public activateUser(id:string):Observable<UserModel>{
        return this.http.put<UserModel>(`${ApiControllers.USERS}/${id}/activate`,null);
    }

    /**
    * Deactivate a  user
    * @param id the id of the user
    * @returns An observable with the de-activated user
    */
    public deactivateUser(id:string):Observable<UserModel>{
        return this.http.put<UserModel>(`${ApiControllers.USERS}/${id}/deactivate`,null);
    }
}