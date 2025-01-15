import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
// import {withDevtools} from "@angular-architects/ngrx-toolkit"
import { initialUserState, UserState } from "./user.state";
import { computed, inject } from "@angular/core";
import { UserRepository } from "../repository/user.repository";
import { UserSearchRequest } from "@models/search.model";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { map, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";
import { CreateUserRequest, UpdateUserRequest, UserModel } from "@models/user.model";
import { UtilService } from "@core/services/util.service";
import { HttpResponse } from "@angular/common/http";
import { HttpUtil } from "@core/services/http-util.service";
import { GenericFile } from "@models/file.model";

export const UserStore = signalStore(
    { providedIn: 'root' },
    // withDevtools('user'),
    withState<UserState>(initialUserState),
    withProps(()=>({
        userRepo:inject(UserRepository),
        utilService:inject(UtilService),
        httpUtil:inject(HttpUtil),
    })),
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
        setCreatedUserId(createdUserId:string | null){
            patchState(state,{
                createdUserId,
            })
        },
        setLoading(loading:boolean){
            patchState(state,{loading:loading,showError:false});
        },
        setError(error:ErrorResponse){
            patchState(state,{loading:false,showError:true,errorMessage:'Error'});
        }
    })),
    withMethods((state)=>{
        const {userRepo,httpUtil,utilService} = state;
        return ({
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
            exportUsersToCsv:rxMethod<UserSearchRequest>(
                pipe(
                    tap(() => {
                        state.setLoading(true)
                    }),
                    switchMap((request)=> 
                        userRepo.exportUsersToCsv(request).pipe(
                            map((responseData: HttpResponse<ArrayBuffer>) =>({
                                filename: httpUtil.getFileNameForContentDisposition(responseData.headers),
                                mimeType: responseData.headers.get('Content-Type')!,
                                arrayBuffer: responseData.body!,
                                id: 0, // Just a random number...
                            })),
                            tapResponse({
                                next:(fileData:GenericFile)=>{
                                    utilService.triggerFileDownLoad(fileData.arrayBuffer, fileData.mimeType!, fileData.filename);
                                    state.setLoading(false)
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
                                    state.setCreatedUserId(result.publicId);
                                    utilService.showMessage('success','User Successfully Registered');
                                },
                                error: (error:ErrorResponse) =>{
                                    state.setError(error)
                                    utilService.showMessage('error',"Couldn't register user");
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
        })
    })
);