import { AuthStore } from './../store/auth/auth-store';
import { effect,Injectable, Signal, untracked } from "@angular/core";
import { UserModel } from "@models/user.model";
import { UtilService } from "./util.service";
import { Router } from "@angular/router";
import { SubmitCredentialsDTO } from "@models/auth.model";
import { JwtPayload } from 'jsonwebtoken';
import { GenericService } from './generic.service';
import { JwtUtil } from './JwtUtil';

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
    private utilService:UtilService,
    private jwtUtil:JwtUtil,
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

    effect(()=>{
      const isUserInStore = this.isLoggedIn();
      const expired =this.isJwtExpired();
      if(!isUserInStore && !expired){
        this.setAccountInfoToStore();
      }
    },{allowSignalWrites:true});
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

  private setAccountInfoToStore():void{
    const token = this.jwtUtil.getToken();
    const expires = this.jwtUtil.getTokenExpiration();
    const userFromStorage = this.getUser(token);
    if(token && expires && userFromStorage){
      this.authStore.setAccountInfo(token,expires,userFromStorage);
    }
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
    if(this.isLoggedIn() || !this.isJwtExpired()){
      return true;
    }
    return false;
  }


  public getUsername():string |null{
    const storeValue=this.authStore.getUsername();
    if(storeValue){
      return storeValue;
    }

    const token = this.jwtUtil.getToken();
    if(!token){
        return null;
    }
    const loggedUser =this.getUser(token) as UserModel;
    const {username} = loggedUser;
    return username;
  }

  /**
   * Checks if the user has the roles
   * @param allowedRoles the supplied roles
   * @returns where the user has access
  */
  public hasRoles(allowedRoles:Array<string>):boolean{
    const userRoles = this.getUserRoles();
    if(!userRoles){
      return false;
    }
    return this.utilService.findCommonElement(userRoles,allowedRoles);
  }

  /**
   * Returns the user roles
   * @returns If the JWT has expired
  */
  public getUserRoles():string[]|null{
        const token = this.jwtUtil.getToken();
        if(!token){
            return null;
        }
        const loggedUser =this.getUser(token) as UserModel;
        // const {roleNames} = loggedUser;
        // return roleNames;
        return null;
  }

  /**
   * Checks if the JWT has expired
   * @returns If the JWT has expired
   */
  public isJwtExpired(): boolean {
    const jwt: JwtPayload | null = this.parseJwtAsPayload(this.jwtUtil.getToken());
    
    if (jwt) {
        const expDate: Date = new Date(jwt.exp! * 1000);
        const nowDate: Date = new Date();
        const isExpired = expDate < nowDate;
        return isExpired;
    } else {
        return true;
    }
  }

  /**
   * Parses the token as Users
   * @param token The string that contains the encoded JWT contents
   * @returns The decoded Users object
  */
  private getUser(token: string | null):UserModel | null{
    const storeValue=this.authStore.getUser();
    if(storeValue){
      return storeValue;
    }

    if (!token) {
      return null;
    }
    const jsonPayload = this.getPayLoad(token);
    return JSON.parse(jsonPayload) as UserModel;
  }

   /**
   * Parses the token as JwtPayload
   * @param token The string that contains the encoded JWT contents
   * @returns The decoded JWT object
  */
   private parseJwtAsPayload(token: string | null): JwtPayload | null {
      if (!token) {
          return null;
      } 
      const jsonPayload = this.getPayLoad(token);
      return JSON.parse(jsonPayload);
    }

    /**
   * Decodes a JWT
   * @param token The string that contains the encoded JWT contents
   * @returns The decoded JWT string
  */
    private getPayLoad(token: string):string{
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
          window
              .atob(base64)
              .split('')
              .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
      );
      return jsonPayload;
    }
}