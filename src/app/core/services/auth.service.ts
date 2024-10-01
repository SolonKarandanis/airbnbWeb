import { Injectable } from "@angular/core";
import { UserModel } from "@models/user.model";
import { Observable } from "rxjs";
import { AuthRepository } from "../repository/auth.repository";
import { UtilService } from "./util.service";
import { Router } from "@angular/router";
import { JwtDTO, SubmitCredentialsDTO } from "@models/auth.model";
import jwtService from "./jwt.service";
import { JwtPayload } from 'jsonwebtoken';

export type UserType = UserModel | undefined;



@Injectable({
  providedIn: 'root',
})
export class AuthService{

  constructor(
    private authRepo: AuthRepository,
    private utilService:UtilService,
    private router: Router,
  ){

  }

  // public methods
  login(credentials:SubmitCredentialsDTO): Observable<JwtDTO> {
    return this.authRepo.login(credentials);
  }

  logout() {
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    return this.authRepo.getUserByToken();
  }

//   getUserOperations():Observable<OperationModel[]>{
//     return this.authRepo.getUserOperations();
//   }

/**
   * Checks if the user is loggedin
   * @returns  if the user is loggedin
  */
  public isLoggedIn():boolean{
    return this.isJwtExpired();
  }


  public getUsername():string |null{
        const token = jwtService.getToken();
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
        const token = jwtService.getToken();
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
        const jwt: JwtPayload | null = this.parseJwtAsPayload(jwtService.getToken());

        if (jwt) {
            const expDate: Date = new Date(jwt.exp! * 1000);
            const nowDate: Date = new Date();

            return expDate < nowDate;
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