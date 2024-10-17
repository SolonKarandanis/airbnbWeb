import { AuthStore } from '../store/auth/auth.store';
import { inject, Injectable, Signal } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { MessageService } from "primeng/api";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    private authStore = inject(AuthStore);
    private messageService = inject(MessageService);
    private translate = inject(TranslateService);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        const isAuthorized = this.isAuthorized(route);
        if(!isAuthorized()){
            this.messageService.add({
                severity: 'error',
                summary: this.translate.instant('GLOBAL.ERRORS.SUMMARY'),
                detail: this.translate.instant('GLOBAL.ERRORS.FORBIDDEN'),
            })
        }
        return isAuthorized();
    }

    private isAuthorized(route:ActivatedRouteSnapshot):Signal<boolean>{
        const allowedRoles = route.data['allowedRoles'] as string[];
        return this.authStore.hasAnyAuthority(allowedRoles);
    }
}