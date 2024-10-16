import { inject, Injectable } from '@angular/core';
import { UserStore } from '../store/user.store';
import { FormControl, FormGroup } from '@angular/forms';
import { UserSearchRequest } from '@models/search.model';
import { RolesConstants } from '@core/guards/SecurityConstants';
import { UpdateUserRequest, UserAccountStatus } from '@models/user.model';
import { GenericService } from '@core/services/generic.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService{

  private userStore = inject(UserStore);

  public user = this.userStore.getUser();
  public userId = this.userStore.getUserId();
  public isLoading = this.userStore.loading();
  public searchResults = this.userStore.searchResults();
  public totalCount = this.userStore.totalCount();


  /**
  * Get the details of a specific user
  * @param id the id of the user
  * @returns nothing
  */
  public executeGetUserById(id:string):void{
    this.userStore.getUserById(id);
  }

  /**
  * Register a new user
  * @param request the request for creating a new user
  * @returns nothing
  */
  public executeRegisterUser(form: FormGroup<CreateUserForm>):void{

  }

  /**
  * Update a selected user
  * @param request the request for updating user
  * @returns nothing
  */
  public executeUpdateUser(form: FormGroup<UpdateUserForm>):void{
    const id = this.userId;
    if(id){
      const request = this.toUpdateUserRequest(form);
      this.userStore.updateUser({id,request});
    }
  }

  /**
   * Initialize the reactive form for updating a user
   * @returns A FormGroup with the appropriate fields
   */
  public initUpdateUserForm(): FormGroup<UpdateUserForm>{
    return this.formBuilder.group<UpdateUserForm>({
      username: new FormControl(this.user!.username),
      firstName: new FormControl(this.user!.firstName),
      lastName: new FormControl(this.user!.lastName),
      email: new FormControl(this.user!.email),
      role: new FormControl(this.user!.role,{nonNullable: true}),
    })
  }

  /**
   * Convert from FormGroup<UpdateUserForm> to UpdateUserRequest
   * @returns A UpdateUserRequest
   */
  protected toUpdateUserRequest(searchForm: FormGroup<UpdateUserForm>):UpdateUserRequest{
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
  * Delete a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeDeleteUser():void{
    if(this.userId){
      this.userStore.deleteUser(this.userId);
    }
  }

  /**
  * Activate a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeActivateUser():void{
    if(this.userId){
      this.userStore.activateUser(this.userId);
    }
  }

  /**
  * Deactivate a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeDeactivateUser():void{
    if(this.userId){
      this.userStore.deactivateUser(this.userId);
    }
  }

  /**
  * Search for users
  * @param request The search criteria
  * @returns nothing
  */
  public executeSearchUsers(searchForm: FormGroup<UserSearchForm>):void{
    const request = this.toUserSearchRequest(searchForm);
    this.userStore.searchUsers(request);
  }

  /**
   * Initialize the reactive form for searching users
   * @returns A FormGroup with the appropriate fields
   */
  public initSearchUserForm(): FormGroup<UserSearchForm>{
    return this.formBuilder.group<UserSearchForm>({
      email: new FormControl(null),
      username: new FormControl(null),
      firstName: new FormControl(null),
      status: new FormControl(UserAccountStatus.ACTIVE,{nonNullable: true}),
      rows: new FormControl(0,{nonNullable: true}),
      first: new FormControl(10,{nonNullable: true}),
    })
  }

  /**
   * Convert from FormGroup<UserSearchForm> to UserSearchRequest
   * @returns A UserSearchRequest
   */
  protected toUserSearchRequest(searchForm: FormGroup<UserSearchForm>):UserSearchRequest{
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

interface UserSearchForm{
  email: FormControl<string|null|undefined>;
  username: FormControl<string|null|undefined>;
  firstName: FormControl<string|null|undefined>;
  status: FormControl<UserAccountStatus>;
  rows:FormControl<number>;
  first:FormControl<number>;
}

interface UpdateUserForm{
  username: FormControl<string|null|undefined>;
  firstName: FormControl<string|null|undefined>;
  lastName: FormControl<string|null|undefined>;
  email: FormControl<string|null|undefined>;
  role:FormControl<RolesConstants>
}

interface CreateUserForm{
  username: FormControl<string|null|undefined>;
  password: FormControl<string|null|undefined>;
  firstName: FormControl<string|null|undefined>;
  lastName: FormControl<string|null|undefined>;
  email: FormControl<string|null|undefined>;
  role:FormControl<RolesConstants>
}
