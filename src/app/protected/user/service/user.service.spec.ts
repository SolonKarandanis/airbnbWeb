import { UserStore } from './../store/user.store';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { mockUpdateUserForm, mockUpdateUserRequest } from 'src/app/testing/mockData';
import { SearchService } from '@core/services/search.service';

type UserStore = InstanceType<typeof UserStore>;

describe('UserService', () => {
  let service: UserService;
  let userStoreSpy: jasmine.SpyObj<UserStore>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  beforeEach(() => {
    userStoreSpy = jasmine.createSpyObj('UserStore',[
      'getUserById',
      'registerUser',
      'updateUser',
      'deleteUser',
      'activateUser',
      'deactivateUser',
      'getUser',
      'getUserId',
      'loading',
      'searchResults',
      'totalCount'
    ]);

    searchServiceSpy= jasmine.createSpyObj('SearchService',[
      'toUpdateUserRequest',
      'toUserSearchRequest'
    ]);


    TestBed.configureTestingModule({
      providers:[
        {
          provide: UserStore,
          useValue: userStoreSpy,
        },
        {
          provide: SearchService,
          useValue: searchServiceSpy,
        },
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute get user by Id', () =>{
    const userId: string = '1';
    service.executeGetUserById(userId);

    expect(userStoreSpy.getUserById).toHaveBeenCalledWith(userId);
    expect(userStoreSpy.getUserById).toHaveBeenCalledTimes(1);
  });

  it('should execute update user ', () =>{
    const userId: string = '1';
    service.userId=userId;
    searchServiceSpy.toUpdateUserRequest.and.returnValue(mockUpdateUserRequest);
    
    service.executeUpdateUser(mockUpdateUserForm);

    expect(searchServiceSpy.toUpdateUserRequest).toHaveBeenCalledWith(mockUpdateUserForm);
    expect(searchServiceSpy.toUpdateUserRequest).toHaveBeenCalledTimes(1);
    expect(userStoreSpy.updateUser).toHaveBeenCalledWith({id:userId,request:mockUpdateUserRequest});
    expect(userStoreSpy.updateUser).toHaveBeenCalledTimes(1);
  });

});
