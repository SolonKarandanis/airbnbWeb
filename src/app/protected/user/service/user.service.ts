import { inject, Injectable } from '@angular/core';
import { UserStore } from '../store/user-store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserSearchRequest } from '@models/search.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userStore = inject(UserStore);
  protected formBuilder = inject(FormBuilder);

  public user = this.userStore.getUser();
  public userId = this.userStore.getUserId();
  public isLoading = this.userStore.loading();
  public searchResults = this.userStore.searchResults();
  public totalCount = this.userStore.totalCount();


  public executeGetUserById(id:string):void{
    this.userStore.getUserById(id);
  }

  public executeRegisterUser(form: FormGroup):void{

  }

  public executeUpdateUser():void{

  }

  public executeDeleteUser():void{
    if(this.userId){
      this.userStore.deleteUser(this.userId);
    }
  }

  public executeActivateUser():void{
    if(this.userId){
      this.userStore.activateUser(this.userId);
    }
  }

  public executeDeactivateUser():void{
    if(this.userId){
      this.userStore.deactivateUser(this.userId);
    }
  }

  public executeSearchUsers(searchForm: FormGroup<UserSearchRequestForm>):void{
    const request = this.toUserSearchRequest(searchForm);
    this.userStore.searchUsers(request);
  }

  public initSearchUserForm(): FormGroup{
    return this.formBuilder.group<UserSearchRequestForm>({
      email: new FormControl(null),
      username: new FormControl(null),
      firstName: new FormControl(null),
      status: new FormControl(null),
      rows: new FormControl(0,{nonNullable: true}),
      first: new FormControl(10,{nonNullable: true}),
    })
  }

  protected toUserSearchRequest(searchForm: FormGroup<UserSearchRequestForm>):UserSearchRequest{
    const {email,firstName,status,username,rows,first} = searchForm.value;
    const request:UserSearchRequest={
      email,
      firstName,
      status,
      username,
      paging:{
        limit:rows!,
        page:first!
      }
    }
    return request;
  }
  
}

interface UserSearchRequestForm{
  email: FormControl<string|null|undefined>;
  username: FormControl<string|null|undefined>;
  firstName: FormControl<string|null|undefined>;
  status: FormControl<string|null|undefined>;
  rows:FormControl<number>;
  first:FormControl<number>;
}
