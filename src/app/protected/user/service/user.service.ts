import { inject, Injectable } from '@angular/core';
import { UserStore } from '../store/user.store';
import { FormControl, FormGroup } from '@angular/forms';
import { UserAccountStatus } from '@models/user.model';
import { GenericService } from '@core/services/generic.service';
import { SearchService } from '@core/services/search.service';
import { CreateUserForm, UpdateUserForm, UserSearchForm } from '../forms';
import { TranslateService } from '@ngx-translate/core';
import { SearchTableColumn } from '@models/search.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService{

  private userStore = inject(UserStore);
  private searchService = inject(SearchService);
  private translateService = inject(TranslateService);

  public user = this.userStore.getUser();
  public userId = this.userStore.getUserId();
  public isLoading = this.userStore.loading();
  public searchResults = this.userStore.searchResults();
  public totalCount = this.userStore.totalCount();


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
    const id = this.userId;
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
    if(this.userId){
      this.userStore.deleteUser(this.userId);
    }
  }

  /**
  * Activate a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeActivateUser():void{
    if(this.userId){
      this.userStore.activateUser(this.userId);
    }
  }

  /**
  * Deactivate a  user
  * @param id the id of the user
  * @returns nothing
  */
  public executeDeactivateUser():void{
    if(this.userId){
      this.userStore.deactivateUser(this.userId);
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
   * Initialize the reactive form for updating a user
   * @returns A FormGroup with the appropriate fields
   */
  public initUpdateUserForm(): FormGroup<UpdateUserForm>{
    return this.formBuilder.group<UpdateUserForm>({
      username: new FormControl(this.user!.username),
      firstName: new FormControl(this.user!.firstName),
      lastName: new FormControl(this.user!.lastName),
      email: new FormControl(this.user!.email),
      role: new FormControl(this.user!.role,{nonNullable: true}),
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

