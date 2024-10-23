import { UserStore } from './../store/user.store';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { mockSearchUserForm, mockUpdateUserForm, mockUpdateUserRequest, mockUser, mockUserSearchRequest } from 'src/app/testing/mockData';
import { SearchService } from '@core/services/search.service';
import { UserAccountStatus } from '@models/user.model';
import { RolesConstants } from '@core/guards/SecurityConstants';

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
      'searchUsers',
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

  it('should execute delete user ', () =>{
    const userId: string = '1';
    service.userId=userId;

    service.executeDeleteUser();

    expect(userStoreSpy.deleteUser).toHaveBeenCalledWith(userId);
    expect(userStoreSpy.deleteUser).toHaveBeenCalledTimes(1);
  });

  it('should execute activate user ', () =>{
    const userId: string = '1';
    service.userId=userId;

    service.executeActivateUser();

    expect(userStoreSpy.activateUser).toHaveBeenCalledWith(userId);
    expect(userStoreSpy.activateUser).toHaveBeenCalledTimes(1);
  });

  it('should execute deactivate user ', () =>{
    const userId: string = '1';
    service.userId=userId;

    service.executeDeactivateUser();

    expect(userStoreSpy.deactivateUser).toHaveBeenCalledWith(userId);
    expect(userStoreSpy.deactivateUser).toHaveBeenCalledTimes(1);
  });

  it('should execute search users ', () =>{
    searchServiceSpy.toUserSearchRequest.and.returnValue(mockUserSearchRequest);

    service.executeSearchUsers(mockSearchUserForm);

    expect(searchServiceSpy.toUserSearchRequest).toHaveBeenCalledWith(mockSearchUserForm);
    expect(searchServiceSpy.toUserSearchRequest).toHaveBeenCalledTimes(1);
    expect(userStoreSpy.searchUsers).toHaveBeenCalledWith(mockUserSearchRequest);
    expect(userStoreSpy.searchUsers).toHaveBeenCalledTimes(1);
  });

  it('should initialize a search users FormGroup', () => {
    const frmGroup = service.initSearchUserForm();
    const formValues = frmGroup.value;

    expect(frmGroup).toBeTruthy();
    expect(formValues).toBeTruthy();

    expect(formValues.email).toBeDefined();
    expect(formValues.email).toEqual(null);

    expect(formValues.username).toBeDefined();
    expect(formValues.username).toEqual(null);

    expect(formValues.firstName).toBeDefined();
    expect(formValues.firstName).toEqual(null);

    expect(formValues.status).toBeDefined();
    expect(formValues.status).toEqual(UserAccountStatus.ACTIVE);

    expect(formValues.rows).toBeDefined();
    expect(formValues.rows).toEqual(10);

    expect(formValues.first).toBeDefined();
    expect(formValues.first).toEqual(0);

    expect(frmGroup.valid).toBeTrue();
  });

  it('should initialize an update users FormGroup', () => {
    service.user=mockUser;
    const frmGroup = service.initUpdateUserForm();
    const formValues = frmGroup.value;

    expect(frmGroup).toBeTruthy();
    expect(formValues).toBeTruthy();

    expect(formValues.email).toBeDefined();
    expect(formValues.email).toEqual('skarandanis@email.com');

    expect(formValues.username).toBeDefined();
    expect(formValues.username).toEqual('skaran');

    expect(formValues.firstName).toBeDefined();
    expect(formValues.firstName).toEqual('solon');

    expect(formValues.lastName).toBeDefined();
    expect(formValues.lastName).toEqual('karandanis');

    expect(formValues.role).toBeDefined();
    expect(formValues.role).toEqual(RolesConstants.ROLE_ADMIN);

    expect(frmGroup.valid).toBeTrue();
  });

});
