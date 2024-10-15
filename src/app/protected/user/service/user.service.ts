import { inject, Injectable } from '@angular/core';
import { UserStore } from '../store/user-store';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userStore = inject(UserStore);

  public user = this.userStore.getUser();
  public userId = this.userStore.getUserId();
  public isLoading = this.userStore.loading();


  public executeGetUserById(id:string):void{
    this.userStore.getUserById(id);
  }

  public executeRegisterUser():void{

  }

  public executeUpdateUser():void{

  }

  public executeDeleteUser():void{
    
  }

  public executeActivateUser():void{
    
  }

  public executeDeactivateUser():void{
    
  }

  public executeSearchUsers():void{

  }
  
}
