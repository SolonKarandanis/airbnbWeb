import { UserModel } from "@models/user.model";

export type UserState ={ 
    readonly loading: boolean,
    readonly errorMessage: string| null;
    readonly showError: boolean;
    readonly selectedUser: UserModel| null;
    readonly searchResults: UserModel[];
    readonly totalCount:number| null;
    // roles:RoleModel[] | undefined;
    // operations: OperationModel[] | undefined;
}

export const initialUserState: UserState = {
    loading: false,
    errorMessage:null,
    showError:false,
    selectedUser: null,
    searchResults: [],
    totalCount: null
};