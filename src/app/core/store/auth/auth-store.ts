import { signalStore,withState,withMethods,withComputed, patchState, withHooks} from "@ngrx/signals";
import { AuthState, initialAuthState } from "./auth-state";
import { computed, inject, Signal } from "@angular/core";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SubmitCredentialsDTO } from "@models/auth.model";
import {pipe, switchMap, tap} from "rxjs"
import { tapResponse } from '@ngrx/operators';
import { UserModel } from "@models/user.model";
import { ErrorResponse } from "@models/error.model";
import { AuthRepository } from "../../repository/auth.repository";
import { JwtUtil } from "@core/services/JwtUtil";

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthState>(initialAuthState),
    withComputed((
        {
            user,
            expires
        },
    )=>({
        getUsername: computed(()=>user()?.username),
        getUser: computed(()=> user()),
        isJwtExpired: computed(()=>{
            const  date= expires()
            if(date){
                const expDate: Date = new Date(Number(date) * 1000);
                const nowDate: Date = new Date();
                const isExpired = expDate < nowDate;
                return isExpired;
            }
            return true;
        }),
    })),
    withMethods((
        state,
        authRepo = inject(AuthRepository),
        jwtUtil = inject(JwtUtil),
    )=>({
        hasAnyAuthority: (authorities: string[] | string): Signal<boolean> => computed(() => {
            if(!state.isLoggedIn()){
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
                    authRepo.login(creadentials).pipe(
                        tapResponse({
                            next:({token,expires})=>{
                                jwtUtil.saveToken(token);
                                jwtUtil.saveTokenExpiration(expires);
                                patchState(state,{authToken:token,expires,errorMessage:null,showError:false,loading:false})
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        }),
                        switchMap(()=>
                            authRepo.getUserByToken().pipe(
                                tapResponse({
                                    next:(response:UserModel)=>{
                                        patchState(state,{isLoggedIn:true,errorMessage:null,showError:false,loading:false,user:response })
                                    },
                                    error: (error:ErrorResponse) =>{
                                        patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                                    }
                                })
                            )
                        )
                    )
                )
            )
        ),
        logout(){
            jwtUtil.destroyToken();
            jwtUtil.destroyTokenExpiration();
            patchState(state,initialAuthState)
        },
        setAccountInfo(token:string,expires:string,user:UserModel){
            patchState(state,{authToken:token,expires,isLoggedIn:true,user});
        },
        getUserAccount: rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(()=>
                    authRepo.getUserByToken().pipe(
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
    withHooks((
        {setAccountInfo},
        jwtUtil = inject(JwtUtil),
    )=>{
        const setAccountInfoToStore =():void =>{
            const token = jwtUtil.getToken();
            const expirationDate = jwtUtil.getTokenExpiration();
            const userFromStorage = jwtUtil.getUser(token);
            const isExpired =jwtUtil.isJwtExpired();
            if(!isExpired && token && expirationDate && userFromStorage){
                setAccountInfo(token,expirationDate,userFromStorage);
            }
        }

        return {
            onInit(){
                setAccountInfoToStore();
            }
        }
    })
);