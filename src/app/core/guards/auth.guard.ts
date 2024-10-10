import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        const isAuthenticated = this.authService.isAuthenticated();
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