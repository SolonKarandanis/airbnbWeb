import { inject, Injectable } from '@angular/core';
import { UserStore } from '../store/user.store';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserAccountStatus } from '@models/user.model';
import { GenericService } from '@core/services/generic.service';
import { SearchService } from '@core/services/search.service';
import { CreateUserForm, UpdateUserForm, UserSearchForm } from '../forms';
import { TranslateService } from '@ngx-translate/core';
import { SearchTableColumn } from '@models/search.model';
import { RolesConstants } from '@core/guards/SecurityConstants';
import { UtilService } from '@core/services/util.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService{

  private userStore = inject(UserStore);
  private searchService = inject(SearchService);
  private translateService = inject(TranslateService);
  private utilService = inject(UtilService);

  public user = this.userStore.getUser;
  public userId = this.userStore.getUserId;
  public isLoading = this.userStore.loading;
  public searchResults = this.userStore.searchResults;
  public totalCount = this.userStore.totalCount;
  public createdUserId = this.userStore.createdUserId;


  /**
  * Get the details of a specific user
  * @param id the id of the user
  * @returns nothing
  */
  public executeGetUserById(id:string):void{
    this.userStore.getUserById(id);
  }

  /**
  * Register a new user
  * @param request the request for creating a new user
  * @returns nothing
  */
  public executeRegisterUser(form: FormGroup<CreateUserForm>):void{
    const request = this.searchService.toCreateUserRequest(form);
    this.userStore.registerUser(request);
  }

  /**
  * Update a selected user
  * @param request the request for updating user
  * @returns nothing
  */
  public executeUpdateUser(form: FormGroup<UpdateUserForm>):void{
    const id = this.userId();
    if(id){
      const request = this.searchService.toUpdateUserRequest(form);
      this.userStore.updateUser({id,request});
    }
  }
  
  /**
  * Delete a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeDeleteUser():void{
    const id = this.userId();
    if(id){
      this.userStore.deleteUser(id);
    }
  }

  /**
  * Activate a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeActivateUser():void{
    const id = this.userId();
    if(id){
      this.userStore.activateUser(id);
    }
  }

  /**
  * Deactivate a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeDeactivateUser():void{
    const id = this.userId();
    if(id){
      this.userStore.deactivateUser(id);
    }
  }

  /**
  * Search for users
  * @param request The search criteria
  * @returns nothing
  */
  public executeSearchUsers(searchForm: FormGroup<UserSearchForm>):void{
    const request = this.searchService.toUserSearchRequest(searchForm);
    this.userStore.searchUsers(request);
  }

  /**
  * Reset created user id
  * @returns nothing
  */
  public resetCreatedUserId():void{
    this.userStore.setCreatedUserId(null);
  }

  /**
   * Initialize the reactive form for updating a user
   * @returns A FormGroup with the appropriate fields
   */
  public initUpdateUserForm(): FormGroup<UpdateUserForm>{
    const user = this.user();
    return this.formBuilder.group<UpdateUserForm>({
      username: new FormControl(user!.username),
      firstName: new FormControl(user!.firstName),
      lastName: new FormControl(user!.lastName),
      email: new FormControl(user!.email),
      role: new FormControl(user!.role,{nonNullable: true}),
    })
  }

  /**
   * Initialize the reactive form for searching users
   * @returns A FormGroup with the appropriate fields
   */
  public initSearchUserForm(): FormGroup<UserSearchForm>{
    return this.formBuilder.group<UserSearchForm>({
      email: new FormControl(null),
      username: new FormControl(null),
      firstName: new FormControl(null),
      status: new FormControl(UserAccountStatus.ACTIVE,{nonNullable: true}),
      rows: new FormControl(10,{nonNullable: true}),
      first: new FormControl(0,{nonNullable: true}),
    })
  }

  /**
   * Initialize the reactive form for creating users
   * @returns A FormGroup with the appropriate fields
   */
  public initCreateUserForm():FormGroup<CreateUserForm>{
    return this.formBuilder.group<CreateUserForm>({
      email: new FormControl(null,[Validators.required,]),
      username: new FormControl(null,[Validators.required,]),
      password:new FormControl(null,[Validators.required,]),
      confirmPassword:new FormControl(null,[Validators.required,]),
      firstName: new FormControl(null,[Validators.required,]),
      lastName:new FormControl(null,[Validators.required,]),
      role:new FormControl(RolesConstants.ROLE_TENANT,[Validators.required])
    },{validators: this.samePasswords()});
  }

  public samePasswords(): ValidatorFn {
    return (frmGroup: AbstractControl): ValidationErrors | null => {
        const pass: string = frmGroup.get('password')?.value;
        const passConf: string = frmGroup.get('confirmPassword')?.value;
        const samePass: boolean = pass === passConf;

        return samePass ? null : { samePassword: {message: "Passwords don't match"} };
    };
  }

  public strongPassword(isViewEdit?: boolean): ValidatorFn {
    return (frmGroup: AbstractControl): ValidationErrors | null => {
        if (isViewEdit && frmGroup.value && frmGroup.value.length === 0) {
            return null;
        }

        const regExp: RegExp = new RegExp(this.utilService.strongPasswordRegex);
        const res = regExp.test(frmGroup.value);
        return res ? null : { strongPassword: true };
    };
  }
  

  /**
   * Get the columns for users in order to initialize the data table
   * @returns The columns of the table
   */
  public getSearchUserTableColumns(): SearchTableColumn[] {
    const translationPrefix: string = 'USER.SEARCH-USERS.RESULTS-TABLE.COLS';
    const tableColumns: SearchTableColumn[] = [
        {
            field: 'username',
            title: this.translateService.instant(`${translationPrefix}.username`),
            isLink: true,
            routerLinkConfig: {
                preRoutes: ['/', 'users'],
                postRoutes: ['details'],
            },
            dataFieldForRoute: 'id',
        },
        {
            field: 'firstName',
            title: this.translateService.instant(`${translationPrefix}.firstName`),
            isLink: false,
            enableSorting: true,
        },
        {
            field: 'lastName',
            title: this.translateService.instant(`${translationPrefix}.lastName`),
            enableSorting: true,
        },
        {
            field: 'email',
            title: this.translateService.instant(`${translationPrefix}.email`),
            isLink: false,
            enableSorting: true,
        },
    ];

    return tableColumns;
  }
}


/**
     * Get the columns for catalogues in order to initialize the data table
     * @param isSearchTable If the table is displayed in advanced search page
     * @returns The columns of the table
     */
// getCataloguesTableColumns(isSearchTable?: boolean): SearchTableColumn[] {
//   const translationPrefix: string = 'ADVANCED-SEARCH.SEARCH-CATALOGUES.RESULTS-TABLE.COLS';
//   const tableColumns: SearchTableColumn[] = [
//       {
//           field: 'id',
//           title: this.translate.instant(`${translationPrefix}.id`),
//           isLink: false,
//           enableSorting: true,
//       },
//   ];

//   tableColumns.push(...this.getCatalogueCommonTableColumns());

//   tableColumns.push(
//       {
//           field: 'validFrom',
//           title: this.translate.instant(`${translationPrefix}.validFrom`),
//           enableSorting: true,
//           isDate: true,
//       },
//       {
//           field: 'validTo',
//           title: this.translate.instant(`${translationPrefix}.validTo`),
//           enableSorting: true,
//           isDate: true,
//       }
//   );

//   if (isSearchTable) {
//       tableColumns.push({
//           field: 'createdBy',
//           title: this.translate.instant(`${translationPrefix}.createdBy`),
//           enableSorting: true,
//       });
//   }

//   return tableColumns;
// }


/**
     * Get the columns for catalogue's history in order to initialize the data table
     * @returns The columns of the table
     */
// getCatalogueHistoryCols(): SearchTableColumn[] {
//   const translationPrefix: string = 'CATALOGUES.HISTORY.TABLE.COLS';
//   const tableColumns: SearchTableColumn[] = [
//       {
//           field: 'id',
//           title: this.translate.instant(`${translationPrefix}.id`),
//           isLink: false,
//           enableSorting: true,
//       },
//       {
//           field: 'title',
//           title: this.translate.instant(`${translationPrefix}.title`),
//           isLink: false,
//           enableSorting: true,
//       },
//       {
//           field: 'version',
//           title: this.translate.instant(`${translationPrefix}.version`),
//           isLink: false,
//           enableSorting: true,
//       },
//       {
//           field: 'statusLabel',
//           title: this.translate.instant(`${translationPrefix}.status`),
//           isLink: false,
//           enableSorting: true,
//       },
//       {
//           field: 'validFrom',
//           title: this.translate.instant(`${translationPrefix}.validFrom`),
//           isLink: false,
//           enableSorting: true,
//       },
//       {
//           field: 'validTo',
//           title: this.translate.instant(`${translationPrefix}.validTo`),
//           isLink: false,
//           enableSorting: true,import { RolesConstants } from '@core/guards/SecurityConstants';
//       },
//       {
//           field: 'dateCreated',
//           title: this.translate.instant(`${translationPrefix}.dateCreated`),
//           isLink: false,
//           enableSorting: true,
//       },
//       {
//           icon: 'fa-regular fa-eye',
//           title: this.translate.instant(`${translationPrefix}.actions`),
//           tooltip: this.translate.instant('GLOBAL.BUTTONS.view-details'),
//           isButton: true,
//           dataFieldForButtonAction: 'id',
//           enableSorting: false,
//       },
//   ];

//   return tableColumns;
// }

