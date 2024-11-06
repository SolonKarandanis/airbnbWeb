import { ListingSearchRequest, Paging, SavedSearchModel, SearchConfigurationCriteria, SearchConfigurationModel, SearchTypeEnum, SortDirection, UserSearchRequest } from '@models/search.model';
import { RolesConstants } from './../core/guards/SecurityConstants';
import { CreateUserRequest, UpdateUserRequest, UserAccountStatus, UserModel } from "@models/user.model";
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtDTO, SubmitCredentialsDTO } from '@models/auth.model';
import { GenericFile } from '@models/file.model';
import { BathsVO, BedroomsVO, BedsVO, DescriptionVO, GuestsVO, PriceVO, TitleVO } from '@models/listing-vo.model';
import { CardListing, CreatedListing, Description, DisplayPicture, LandlordListing, NewListing, NewListingInfo } from '@models/listing.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CreateUserForm, UpdateUserForm, UserSearchForm } from '../protected/user/forms';
import { NewListingPicture } from '@models/picture.model';
import { Country, CountryName, OfficialAndCommon } from '@models/country.model';

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

export const mockSearchUserForm:FormGroup= new FormGroup<UserSearchForm>({
    email: new FormControl(''),
    first: new FormControl(0,{nonNullable: true}),
    rows: new FormControl(10,{nonNullable: true}),
    firstName: new FormControl(''),
    status:new FormControl(UserAccountStatus.ACTIVE,{nonNullable: true}),
    username: new FormControl(''),
});

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

export const mockFile = new File([], 'test');

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

export const mockCreateUserForm:FormGroup= new FormGroup<CreateUserForm>({
    email: new FormControl(''),
    firstName: new FormControl(''),
    username: new FormControl(''),
    lastName: new FormControl(''),
    role:new FormControl(RolesConstants.ROLE_LANDLORD,{nonNullable: true}),
    password:new FormControl(''),
});


export const mockUpdateUserRequest:UpdateUserRequest={
    email:'test',
    firstName:'test',
    lastName:'test',
    role:RolesConstants.ROLE_LANDLORD,
    username:'test'
};

export const mockUpdateUserForm:FormGroup= new FormGroup<UpdateUserForm>({
    email: new FormControl(''),
    firstName: new FormControl(''),
    username: new FormControl(''),
    lastName: new FormControl(''),
    role:new FormControl(RolesConstants.ROLE_LANDLORD,{nonNullable: true}),
});

export const mockPriceVO:PriceVO={
    value:1
};

export const mockDescriptionVO:DescriptionVO={
    value:'test'
};

export const mockTitleVO:TitleVO={
     value:'test'
};

export const mockBathsVO:BathsVO={
    value:1
};

export const mockBedsVO:BedsVO={
    value:1
};

export const mockBedroomsVO:BedroomsVO={
    value:1
};

export const mockGuestsVO:GuestsVO={
    value:1
};

export const mockNewListingInfo:NewListingInfo={
    baths:mockBathsVO,
    bedrooms:mockBedroomsVO,
    beds:mockBedsVO,
    guests:mockGuestsVO
};

export const mockLandlordListing:LandlordListing={
    firstname:'test',
    imageUrl:'test'
};

export const mockDescription:Description={
    description:mockDescriptionVO,
    title:mockTitleVO
};

export const mockCreatedListing:CreatedListing={
    publicId:'test'
};

export const mockDisplayPicture:DisplayPicture={

}

export const mockCardListing:CardListing={
    price:mockPriceVO,
    location:'test',
    cover:mockDisplayPicture,
    bookingCategory:'ALL',
    publicId:'test',
    loading:false,
}

export const mockNewListing:NewListing={
    category:'ALL',
    description:mockDescription,
    infos:mockNewListingInfo,
    location:'test',
    price:mockPriceVO
}

export const mockNewListingPicture:NewListingPicture={
    file:mockFile,
    urlDisplay: 'test'
}


export const mockCountry:Country={
    name:{
        common:"Aruba",
        official:"Aruba",
        native:{
            "nld": {
                "official": "Aruba",
                "common": "Aruba"
            },
            "pap": {
                "official": "Aruba",
                "common": "Aruba"
            }
        }
    },
    tld:[
        ".aw"
    ],
    cca2: "AW",
    ccn3: "533",
    cca3: "ABW",
    cioc: "ARU",
    independent: false,
    status: "officially-assigned",
    currencies: {
        "AWG": {
            "name": "Aruban florin",
            "symbol": "\u0192"
        }
    },
    idd:{
        root: "+2",
        suffixes: [
          "97"
        ]
    },
    capital: [
        "Oranjestad"
    ],
    altSpellings: [
        "AW"
    ],
    region: "Americas",
    subregion: "Caribbean",
    languages: {
        "nld": "Dutch",
        "pap": "Papiamento"
    },
    translations:{
        "ces": {
            "official": "Aruba",
            "common": "Aruba"
        },
        "deu": {
            "official": "Aruba",
            "common": "Aruba"
        },
    },
    latlng:[
        12.5,
        -69.96666666
    ],
    landlocked: false,
    borders: [],
    area: 180,
    flag: "\ud83c\udde6\ud83c\uddfc",
    demonyms:{
        "eng": {
            "f": "Aruban",
            "m": "Aruban"
        },
        "fra": {
            "f": "Arubaise",
            "m": "Arubais"
        }
    }
}