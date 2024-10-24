import { FormControl } from "@angular/forms";
import { RolesConstants } from "@core/guards/SecurityConstants";
import { UserAccountStatus } from "@models/user.model";

export interface UserSearchForm{
    email: FormControl<string|null|undefined>;
    username: FormControl<string|null|undefined>;
    firstName: FormControl<string|null|undefined>;
    status: FormControl<UserAccountStatus>;
    rows:FormControl<number>;
    first:FormControl<number>;
}
  
export interface UpdateUserForm{
    username: FormControl<string|null|undefined>;
    firstName: FormControl<string|null|undefined>;
    lastName: FormControl<string|null|undefined>;
    email: FormControl<string|null|undefined>;
    role:FormControl<RolesConstants>
}
  
export interface CreateUserForm{
    username: FormControl<string|null|undefined>;
    password: FormControl<string|null|undefined>;
    firstName: FormControl<string|null|undefined>;
    lastName: FormControl<string|null|undefined>;
    email: FormControl<string|null|undefined>;
    role:FormControl<RolesConstants>
}