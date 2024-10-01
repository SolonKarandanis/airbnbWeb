import { HttpContextToken } from "@angular/common/http";

export enum RolesConstants{
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_TENANT = "ROLE_TENANT",
    ROLE_LANDLORD = "ROLE_LANDLORD",
}

export const userRoles =[
    RolesConstants.ROLE_ADMIN,
    RolesConstants.ROLE_TENANT,
    RolesConstants.ROLE_LANDLORD,
];

export const AUTHENTICATE_REQUEST = new HttpContextToken(() => true);