import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { FormGroup } from "@angular/forms";
import { UpdateUserRequest } from "@models/user.model";

import { UserSearchRequest } from "@models/search.model";
import { UpdateUserForm, UserSearchForm } from "src/app/protected/user/forms";

@Injectable({
    providedIn: 'root'
})
export class SearchService extends GenericService{

/**
 * Convert from FormGroup<UpdateUserForm> to UpdateUserRequest
 * @returns A UpdateUserRequest
 */
  public toUpdateUserRequest(searchForm: FormGroup<UpdateUserForm>):UpdateUserRequest{
    const {email,firstName,username,lastName,role} = searchForm.value;
    const request:UpdateUserRequest={
      email:email!,
      firstName:firstName!,
      username:username!,
      lastName:lastName!,
      role:role!
    }
    return request;
  }

/**
 * Convert from FormGroup<UserSearchForm> to UserSearchRequest
 * @returns A UserSearchRequest
 */
public toUserSearchRequest(searchForm: FormGroup<UserSearchForm>):UserSearchRequest{
    const {email,firstName,status,username,rows,first} = searchForm.value;
    const request:UserSearchRequest={
      email,
      firstName,
      status:status!,
      username,
      paging:{
        limit:rows!,
        page:first!
      }
    }
    return request;
  }
}