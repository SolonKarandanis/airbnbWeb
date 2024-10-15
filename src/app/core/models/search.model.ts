export type SearchResult<T>={
    list:T[],
    countRows:number
  }
  
  export interface SearchTableColumn {
    title: string;
    field: string;
    isLink?: boolean;
    routerLinkConfig?: SearchTableColumnLinkRouterConf;
    dataFieldForRoute?: string;
    isCheckbox?: boolean;
    isButton?: boolean;
    icon?: string;
    style?:string;
    enableSorting?: boolean;
    isDate?: boolean;
    isImage?: boolean;
    isTranslatable?:boolean;
    onlyIcon?:boolean;
    isStatus?:boolean;
    isTableActions?:boolean;
    toolTip?:string;
    dataForToolTip?:string;
    actions?:SearchTableColumnAction[];
  }

  export interface SearchTableColumnAction{
    type:ActionTypes;
    toolTip:string;
    dataForToolTip?:string;
    routerLinkConfig?: SearchTableColumnLinkRouterConf;
    dataFieldForRoute?: string;
    isLink?: boolean;
    isButton?:boolean;
    callbackFn?:(args?: any) => void;
  }

  export enum ActionTypes{
    VIEW='VIEW',
    EDIT='EDIT',
    DELETE='DELETE'
  }
  
  export interface SearchTableColumnLinkRouterConf {
    preRoutes?: string[];
    postRoutes?: string[];
  }
  
  export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
  }
  
  export interface Paging {
    page: number;
    limit: number;
    sortField?: string;
    sortDirection?: SortDirection;
  }

  export interface SearchRequest {
    paging: Paging;
  }
  
  export interface UserSearchRequest extends SearchRequest {
    username: string|null|undefined;
    firstName: string|null|undefined;
    email: string|null|undefined;
    status: string|null|undefined;
  }

  export interface ListingSearchRequest extends SearchRequest{

  }

  export type SearchRequestCriteria = UserSearchRequest | ListingSearchRequest;
  
  export enum SearchTypeEnum {
    ATC_VERSIONS = 'search.type.atcversions',
    USERS = 'search.type.users',
    PRODUCT_LIST_VERSION= 'search.type.product.list.version',
    PRODUCT_LIST= 'search.type.product.list'
  }


  export interface SavedSearchModel {
    id?: number;
    username: string;
    searchType: SearchTypeEnum;
    savedSearchName: string;
    criteria: SearchRequestCriteria;
  }
  
  export interface SearchConfigurationCriteria {
    fieldName: string;
    searchable: boolean;
    displayable: boolean;
    customizable: boolean;
    sortable?: boolean;
    canFieldBeSearched: boolean;
    canFieldBeDisplayed: boolean;
  }
  
  export interface SearchConfigurationModel {
    id?: number;
    username: string;
    searchType: SearchTypeEnum;
    resultCount: number;
    sortColumnKey?: string;
    sortDirection?: SortDirection;
    criteria: SearchConfigurationCriteria[];
  }