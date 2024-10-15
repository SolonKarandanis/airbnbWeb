import { RolesConstants } from "@core/guards/SecurityConstants";

export enum UserAccountStatus{
    ACTIVE,
    INACTIVE,
    DELETED
}

export interface BaseUserModel{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserModel extends UserWithRole{
    publicId: string;
    imageUrl: string;
    status: UserAccountStatus;
    authorities:string[]
}

export interface UserWithRole extends BaseUserModel{
    role:RolesConstants;
}

export interface CreateUserRequest extends UserWithRole{
    password:string;
}

export interface UpdateUserRequest extends UserWithRole{
}