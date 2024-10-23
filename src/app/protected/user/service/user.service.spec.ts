import { UserStore } from './../store/user.store';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

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
});
