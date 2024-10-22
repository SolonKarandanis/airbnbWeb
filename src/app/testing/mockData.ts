import { ListingSearchRequest, Paging, SavedSearchModel, SearchConfigurationCriteria, SearchConfigurationModel, SearchTypeEnum, SortDirection, UserSearchRequest } from '@models/search.model';
import { RolesConstants } from './../core/guards/SecurityConstants';
import { CreateUserRequest, UpdateUserRequest, UserAccountStatus, UserModel } from "@models/user.model";
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtDTO, SubmitCredentialsDTO } from '@models/auth.model';
import { GenericFile } from '@models/file.model';

export const mockUser: UserModel ={
    username:"skaran",
    status:UserAccountStatus.ACTIVE,
    publicId:"test",
    email:"skarandanis@email.com",
    firstName:"solon",
    lastName:"karandanis",
    imageUrl:"test",
    authorities:[RolesConstants.ROLE_ADMIN],
    role:RolesConstants.ROLE_ADMIN

}

export const mockBlob: Blob = new Blob([JSON.stringify({})], {
    type: 'application/json',
});


export const mockArrayBuffer: ArrayBuffer = new ArrayBuffer(16);

export const mockHeaders = new HttpHeaders().append('Content-Type', 'application/octet-stream');

export const mockArrayBufferResponse = new HttpResponse({ body: mockArrayBuffer, headers: mockHeaders });


export const mockPaging: Paging = {
    page: 1,
    limit: 10,
};

export const mockUserSearchRequest:UserSearchRequest={
    paging: {
        page: 1,
        limit: 10,
        sortField: 'name',
        sortDirection: SortDirection.ASC,
    },
    username: 'org123',
    firstName: 'John',
    status:UserAccountStatus.ACTIVE,
    email:'skarandanis@gmail.com',
};

export const mockListingSearchRequest:ListingSearchRequest={
    paging: {
        page: 1,
        limit: 10,
        sortField: 'name',
        sortDirection: SortDirection.ASC,
    },
    baths:null,
    bedrooms:null,
    beds:null,
    endDate:'test',
    guests:null,
    location:'test',
    startDate:'test'
};

export const mockSavedSearch: SavedSearchModel = {
    id: 123,
    userId: '456',
    searchType: SearchTypeEnum.USERS,
    savedSearchName: 'My Saved Item Search',
    criteria: {
        paging: {
            page: 1,
            limit: 10,
            sortField: 'name',
            sortDirection: SortDirection.ASC,
        },
        username: 'org123',
        firstName: 'John',
        status:UserAccountStatus.ACTIVE,
        email:'skarandanis@gmail.com',
        baths:null,
        bedrooms:null,
        beds:null,
        endDate:'test',
        guests:null,
        location:'test',
        startDate:'test'
    },
};

export const mockSearchConfiguration: SearchConfigurationModel = {
    id: 789,
    userId: '456',
    searchType: SearchTypeEnum.USERS,
    resultCount: 50,
    sortColumnKey: 'name',
    sortDirection: SortDirection.ASC,
    criteria: [
        {
            canFieldBeDisplayed: true,
            canFieldBeSearched: true,
            customizable: true,
            displayable: true,
            fieldName: 'test',
            searchable: true,
        },
    ],
};

export const mockLoginCredentials: SubmitCredentialsDTO = {
    password: 'test',
    username: 'test',
};

export const mockJwt: JwtDTO = {
    token: 'test',
    expires: 'test',
};

export const mockGenericFile: GenericFile = {
    filename: 'filename',
    id: 0,
    arrayBuffer: mockArrayBuffer,
    mimeType: 'application/octet-stream',
};

export const mockUserSearchConfiguration: SearchConfigurationModel = {
    id: 1,
    userId: '5',
    sortDirection: SortDirection.ASC,
    sortColumnKey: 'test',
    resultCount: 10,
    searchType: SearchTypeEnum.USERS,
    criteria: [],
};

export const mockSkuSearchConfigurationCriterion: SearchConfigurationCriteria = {
    fieldName: 'sku',
    searchable: true,
    canFieldBeSearched: true,
    customizable: true,
    displayable: true,
    canFieldBeDisplayed: true,
};

export const mockItemNameSearchConfigurationCriterion: SearchConfigurationCriteria = {
    fieldName: 'itemName',
    searchable: true,
    canFieldBeSearched: true,
    customizable: true,
    displayable: true,
    canFieldBeDisplayed: true,
};

export const mockCreateUserRequest:CreateUserRequest={
    email:'test',
    firstName:'test',
    lastName:'test',
    password:'test',
    role:RolesConstants.ROLE_TENANT,
    username:'test'
};

export const mockUpdateUserRequest:UpdateUserRequest={
    email:'test',
    firstName:'test',
    lastName:'test',
    role:RolesConstants.ROLE_LANDLORD,
    username:'test'
};