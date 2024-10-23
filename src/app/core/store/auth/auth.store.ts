import { signalStore,withState,withMethods,withComputed, patchState, withHooks} from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit"
import { AuthState, initialAuthState } from "./auth.state";
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
    withDevtools('auth'),
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
    withMethods((state,jwtUtil = inject(JwtUtil),)=>({
        hasAnyAuthority: (authorities: string[] | string): Signal<boolean> => computed(() => {
            if(!state.isLoggedIn()){
                return false;
            }
            if(!Array.isArray(authorities)) {
                authorities = [authorities];
            }

            return state.user()!.authorities.some((authority:string)=> authorities.includes(authority));
        }),
        setTokenDetails(authToken:string,expires:string){
            jwtUtil.saveToken(authToken);
            jwtUtil.saveTokenExpiration(expires);
            patchState(state,{authToken,expires,errorMessage:null,showError:false,loading:false})
        },
        setAccountInfoFromStorage(token:string,expires:string,user:UserModel){
            patchState(state,{authToken:token,expires,isLoggedIn:true,user});
        },
        setAccount(user:UserModel){
            patchState(state,{isLoggedIn:true,errorMessage:null,showError:false,loading:false,user })
        },
        logout(){
            jwtUtil.destroyToken();
            jwtUtil.destroyTokenExpiration();
            patchState(state,initialAuthState)
        },
        
        setLoading(loading:boolean){
            patchState(state,{loading:loading,showError:false});
        },
        setError(error:ErrorResponse){
            patchState(state,{loading:false,showError:true,errorMessage:'Error'});
        }

    })),
    withMethods((
        state,
        authRepo = inject(AuthRepository),
    )=>({
        login: rxMethod<SubmitCredentialsDTO>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((creadentials)=> 
                    authRepo.login(creadentials).pipe(
                        tapResponse({
                            next:({token,expires})=>{
                                state.setTokenDetails(token,expires);
                               
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        }),
                        switchMap(()=>
                            authRepo.getUserByToken().pipe(
                                tapResponse({
                                    next:(response:UserModel)=>{
                                        state.setAccount(response)
                                    },
                                    error: (error:ErrorResponse) =>{
                                        state.setError(error)
                                    }
                                })
                            )
                        )
                    )
                )
            )
        ),
        getUserAccount: rxMethod<void>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap(()=>
                    authRepo.getUserByToken().pipe(
                        tapResponse({
                            next:(response:UserModel)=>{
                                state.setAccount(response)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        )
    })),
    withHooks((
        {setAccountInfoFromStorage},
        jwtUtil = inject(JwtUtil),
    )=>{
        const setAccountInfoToStore =():void =>{
            const token = jwtUtil.getToken();
            const expirationDate = jwtUtil.getTokenExpiration();
            const userFromStorage = jwtUtil.getUser(token);
            const isExpired =jwtUtil.isJwtExpired();
            if(!isExpired && token && expirationDate && userFromStorage){
                setAccountInfoFromStorage(token,expirationDate,userFromStorage);
            }
        }

        return {
            onInit(){
                setAccountInfoToStore();
            }
        }
    })
);