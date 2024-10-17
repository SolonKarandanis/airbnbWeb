import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class JwtUtil{

    private readonly ID_TOKEN_KEY = "authToken" as string;
    private readonly ID_TOKEN_KEY_EXPIRATION = "authTokenExpires" as string;

    /**
     * @description get token form localStorage
     */
    public getToken():string | null {
        return window.sessionStorage.getItem(this.ID_TOKEN_KEY);
    }

    /**
     * @description save token into localStorage
     * @param token: string
     */
    public saveToken(token: string):void{
        window.sessionStorage.setItem(this.ID_TOKEN_KEY, token);
    }

    /**
     * @description remove token form localStorage
     */
    public destroyToken():void{
        window.sessionStorage.removeItem(this.ID_TOKEN_KEY);
    }

    /**
    * @description get token expiration form localStorage
    */
   public getTokenExpiration():string | null{
        return window.sessionStorage.getItem(this.ID_TOKEN_KEY_EXPIRATION);
   }

   /**
    * @description save token expiration into localStorage
    * @param token: string
    */
   public saveTokenExpiration(expires: string):void{
        window.sessionStorage.setItem(this.ID_TOKEN_KEY_EXPIRATION, expires);
   }

   /**
    * @description remove token expiration form localStorage
    */
    public destroyTokenExpiration():void{
        window.sessionStorage.removeItem(this.ID_TOKEN_KEY_EXPIRATION);
    }
}