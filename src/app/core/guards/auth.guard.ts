import { AuthStore } from 'src/app/core/store/auth/auth-store';
import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private authStore = inject(AuthStore);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        const isAuthenticated = this.authStore.isAuthenticated();
        console.log(isAuthenticated);
        if(isAuthenticated){
            this.navigateToLogin();
        }
        return isAuthenticated;
    }

    private navigateToLogin():void{
        this.router.navigateByUrl('/auth/login');
    }

}