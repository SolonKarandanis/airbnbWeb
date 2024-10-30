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
import { CreateUserRequest, UpdateUserRequest, UserModel } from "@models/user.model";

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
    withMethods((state)=>({
        setSearchResults(searchResults:UserModel[],totalCount:number){
            patchState(state,{
                searchResults,
                totalCount,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setSelectedUser(selectedUser:UserModel| null){
            patchState(state,{
                selectedUser,
                errorMessage:null,
                showError:false,
                loading:false
            })
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
        userRepo = inject(UserRepository),
    )=>({
        searchUsers: rxMethod<UserSearchRequest>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((request)=> 
                    userRepo.searchUsers(request).pipe(
                        tapResponse({
                            next:({list,countRows})=>{
                                state.setSearchResults(list,countRows)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        getUserById: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((id)=> 
                    userRepo.getUserById(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSelectedUser(result)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        registerUser: rxMethod<CreateUserRequest>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((request)=>
                    userRepo.registerUser(request).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSelectedUser(result)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        updateUser: rxMethod<{id:string, request:UpdateUserRequest}>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap(({id,request})=>
                    userRepo.updateUser(id,request).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSelectedUser(result)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        deleteUser: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((id)=>
                    userRepo.deleteUser(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSelectedUser(null)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        activateUser: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((id)=> 
                    userRepo.activateUser(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSelectedUser(result)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
        deactivateUser: rxMethod<string>(
            pipe(
                tap(() => {
                    state.setLoading(true)
                }),
                switchMap((id)=> 
                    userRepo.deactivateUser(id).pipe(
                        tapResponse({
                            next:(result)=>{
                                state.setSelectedUser(result)
                            },
                            error: (error:ErrorResponse) =>{
                                state.setError(error)
                            }
                        })
                    )
                )
            )
        ),
    }))
);