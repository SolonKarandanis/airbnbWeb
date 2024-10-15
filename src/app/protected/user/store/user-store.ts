import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { initialUserState, UserState } from "./user-state";
import { inject } from "@angular/core";
import { UserRepository } from "../repository/user.repository";
import { UserSearchRequest } from "@models/search.model";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState<UserState>(initialUserState),
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
    }))
);