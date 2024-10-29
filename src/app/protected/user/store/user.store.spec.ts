import { TestBed } from '@angular/core/testing';
import { UserRepository } from '../repository/user.repository';
import { UserStore } from './user.store';

type UserStore = InstanceType<typeof UserStore>;

describe('UserStore', () =>{
    let store: UserStore;
    let userRepoSpy: jasmine.SpyObj<UserRepository>;

    beforeEach(()=>{
        userRepoSpy = jasmine.createSpyObj('UserRepository',[
            'searchUsers',
            'getUserById',
            'registerUser',
            'updateUser',
            'deleteUser',
            'activateUser',
            'deactivateUser',
        ]);

        TestBed.configureTestingModule({
            providers:[
              {
                provide: UserRepository,
                useValue: userRepoSpy,
              },
            ]
        });

        store = TestBed.inject(UserStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });
});