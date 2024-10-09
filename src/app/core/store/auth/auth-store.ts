import { signalStore,withState,withMethods,withComputed, patchState} from "@ngrx/signals";
import { AuthState, initialAuthState } from "./auth-state";
import { AuthService } from "../../services/auth.service";
import { computed, inject, Signal } from "@angular/core";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SubmitCredentialsDTO } from "@models/auth.model";
import {pipe, switchMap, tap} from "rxjs"
import { tapResponse } from '@ngrx/operators';
import { UserModel } from "@models/user.model";
import { UtilService } from "../../services/util.service";
import { ErrorResponse } from "@models/error.model";

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthState>(initialAuthState),
    withComputed((
        {
            isLoggedIn,
            user
        },
        authService = inject(AuthService)
    )=>({
        isAuthenticated: computed(()=>{
            if(isLoggedIn() || authService.isLoggedIn()){
                return true;
            }
            return false;
        }),
    })),
    withMethods((
        state,
        authService = inject(AuthService),
        utilService = inject(UtilService),
    )=>({
        hasAnyAuthority: (authorities: string[] | string): Signal<boolean> => computed(() => {
            if(state.isAuthenticated()){
                return false;
            }
            if(!Array.isArray(authorities)) {
                authorities = [authorities];
            }

            return state.user()!.authorities.some((authority:string)=> authorities.includes(authority));
        }),
        login: rxMethod<SubmitCredentialsDTO>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((creadentials)=> 
                    authService.login(creadentials).pipe(
                        tapResponse({
                            next:({authToken,expires})=>{
                                patchState(state,{authToken,expires,errorMessage:null,showError:false,loading:false})
                            },
                            error: (error:ErrorResponse) =>{
                                utilService.showMessage('error',error.error);
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        logout(){
            patchState(state,initialAuthState)
            authService.logout();
        },
        getUserAccount: rxMethod(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(()=>
                    authService.getUserByToken().pipe(
                        tapResponse({
                            next:(response:UserModel)=>{
                                patchState(state,{isLoggedIn:true,errorMessage:null,showError:false,loading:false,user:response })
                            },
                            error: () =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        )
    })),
);