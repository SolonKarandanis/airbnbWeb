import { AuthStore } from '../store/auth/auth.store';
import { effect,Injectable, Signal, untracked } from "@angular/core";
import { UserModel } from "@models/user.model";
import { Router } from "@angular/router";
import { SubmitCredentialsDTO } from "@models/auth.model";
import { GenericService } from './generic.service';

export type UserType = UserModel | undefined;
type AuthStore = InstanceType<typeof AuthStore>;


@Injectable({
  providedIn: 'root',
})
export class AuthService extends GenericService{

  public isLoading:Signal<boolean>;
  public isLoggedIn:Signal<boolean>;
  public loggedUser:Signal<UserModel| undefined>;

  constructor(
    private authStore:AuthStore,
    private router:Router,
  ){
    super()
    this.isLoading = this.authStore.loading;
    this.isLoggedIn = this.authStore.isLoggedIn;
    this.loggedUser=this.authStore.getUser;

    effect(()=>{
      const loggedIn=this.isAuthenticated();
      if(loggedIn){
        untracked(()=>{
          this.navigateToHome();
        });
      }
    });
  }


  private navigateToHome():void{
    this.router.navigate(['/home'], {
      queryParams: {},
    });
  }

  private navigateToLogin():void{
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }


  // public methods
  public login(credentials:SubmitCredentialsDTO):void{
    this.authStore.login(credentials);
  }

  public logout() {
    this.authStore.logout();
    this.navigateToLogin();
  }

  public getUserByToken():void {
    this.authStore.getUserAccount();
  }

  public hasAnyAuthority(authorities: string[] | string):Signal<boolean>{
    return this.authStore.hasAnyAuthority(authorities);
  }

//   getUserOperations():Observable<OperationModel[]>{
//     return this.authRepo.getUserOperations();
//   }

/**
   * Checks if the user is loggedin
   * @returns  if the user is loggedin
  */
  public isAuthenticated():boolean{
    if(this.isLoggedIn() && !this.authStore.isJwtExpired()){
      return true;
    }
    return false;
  }


  public getUsername():string |null{
    const storeValue=this.authStore.getUsername();
    if(storeValue){
      return storeValue;
    }
    return null;
  }

  /**
   * Checks if the user has the roles
   * @param allowedRoles the supplied roles
   * @returns where the user has access
  */
  // public hasRoles(allowedRoles:Array<string>):boolean{
  //   const userRoles = this.getUserRoles();
  //   if(!userRoles){
  //     return false;
  //   }
  //   return this.utilService.findCommonElement(userRoles,allowedRoles);
  // }

  /**
   * Returns the user roles
   * @returns If the JWT has expired
  */
  // public getUserRoles():string[]|null{
  //     const token = this.jwtUtil.getToken();
  //     if(!token){
  //         return null;
  //     }
  //     // const loggedUser =this.getUser(token) as UserModel;
  //     // const {roleNames} = loggedUser;
  //     // return roleNames;
  //     return null;
  // }

}