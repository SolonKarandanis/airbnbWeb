import { signalStore,withState,withMethods,withComputed, patchState} from "@ngrx/signals";
import { AuthState, initialAuthState } from "./auth-state";
import { AuthService } from "../../services/auth.service";
import { inject } from "@angular/core";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SubmitCredentialsDTO } from "@models/auth.model";
import {pipe, switchMap, tap} from "rxjs"
import { tapResponse } from '@ngrx/operators';
import { UserModel } from "@models/user.model";

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthState>(initialAuthState),
    withMethods((
        state,
        authService = inject(AuthService)
    )=>({
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
                            error: () =>{
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