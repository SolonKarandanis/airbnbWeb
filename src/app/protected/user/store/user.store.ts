import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit"
import { initialUserState, UserState } from "./user.state";
import { computed, inject } from "@angular/core";
import { UserRepository } from "../repository/user.repository";
import { UserSearchRequest } from "@models/search.model";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";
import { CreateUserRequest, UpdateUserRequest } from "@models/user.model";

export const UserStore = signalStore(
    { providedIn: 'root' },
    withDevtools('user'),
    withState<UserState>(initialUserState),
    withComputed((
        {
            selectedUser
        },
    )=>({
        getUsername: computed(()=>{
            return selectedUser()?.username;
        }),
        getUserId: computed(()=>{
            return selectedUser()?.publicId;
        }),
        getUser: computed(()=>{
            return selectedUser();
        }),
    })),
    withMethods((
        state,
        userRepo = inject(UserRepository),
    )=>({
        searchUsers: rxMethod<UserSearchRequest>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((request)=> 
                    userRepo.searchUsers(request).pipe(
                        tapResponse({
                            next:({list,countRows})=>{
                                patchState(state,{
                                    searchResults:list,
                                    totalCount:countRows,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        getUserById: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=> 
                    userRepo.getUserById(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedUser:result,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        registerUser: rxMethod<CreateUserRequest>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((request)=>
                    userRepo.registerUser(request).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedUser:result,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        updateUser: rxMethod<{id:string, request:UpdateUserRequest}>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap(({id,request})=>
                    userRepo.updateUser(id,request).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedUser:result,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        deleteUser: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=>
                    userRepo.deleteUser(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{loading:false,showError:false});
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        activateUser: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=> 
                    userRepo.activateUser(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedUser:result,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
        deactivateUser: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(state,{loading:true,showError:false});
                }),
                switchMap((id)=> 
                    userRepo.deactivateUser(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                patchState(state,{
                                    selectedUser:result,
                                    errorMessage:null,
                                    showError:false,
                                    loading:false
                                })
                            },
                            error: (error:ErrorResponse) =>{
                                patchState(state,{loading:false,showError:true,errorMessage:'Error'});
                            }
                        })
                    )
                )
            )
        ),
    }))
);