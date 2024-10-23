import { UserStore } from './../store/user.store';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { mockUpdateUserRequest } from 'src/app/testing/mockData';

type UserStore = InstanceType<typeof UserStore>;

describe('UserService', () => {
  let service: UserService;
  let userStoreSpy: jasmine.SpyObj<UserStore>;

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

    TestBed.configureTestingModule({
      providers:[
        {
          provide: UserStore,
          useValue: userStoreSpy,
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
    userStoreSpy.getUserId.and.returnValue(userId);
    
    // service.executeUpdateUser(userId);

    expect(userStoreSpy.updateUser).toHaveBeenCalledWith({id:userId,request:mockUpdateUserRequest});
    expect(userStoreSpy.updateUser).toHaveBeenCalledTimes(1);
  });

});
