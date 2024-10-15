export interface BaseUserModel{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserModel extends BaseUserModel{
    imageUrl: string;
    status: string;
    authorities:string[]
}

export interface CreateUserRequest extends BaseUserModel{
    password:string;
    role:string;
}

export interface UpdateUserRequest{
    role:string;
}