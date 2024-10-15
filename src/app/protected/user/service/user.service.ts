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

  public executeSearchUsers():void{

  }
  
}
