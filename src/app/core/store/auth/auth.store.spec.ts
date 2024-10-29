import { AuthRepository } from "@core/repository/auth.repository";
import { AuthStore } from "./auth.store";
import { TestBed } from "@angular/core/testing";
import { mockJwt, mockLoginCredentials, mockUser } from "src/app/testing/mockData";
import { of } from "rxjs";
import { JwtUtil } from "@core/services/JwtUtil";

type AuthStore = InstanceType<typeof AuthStore>;

describe('AuthStore', () =>{
    let store: AuthStore;
    let authRepoSpy: jasmine.SpyObj<AuthRepository>;
    let jwtUtilSpy: jasmine.SpyObj<JwtUtil>;

    beforeEach(()=>{
        authRepoSpy = jasmine.createSpyObj('AuthRepository',[
            'login',
            'getUserByToken',
        ]);

        jwtUtilSpy = jasmine.createSpyObj('JwtUtil',[
            'getToken',
            'getTokenExpiration',
            'getUser',
            'isJwtExpired',
            'saveToken',
            'saveTokenExpiration',
        ]);

        TestBed.configureTestingModule({
            providers:[
              {
                provide: AuthRepository,
                useValue: authRepoSpy,
              },
              {
                provide: JwtUtil,
                useValue: jwtUtilSpy,
              },
            ]
        });

        store = TestBed.inject(AuthStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should perform login ', () =>{
        authRepoSpy.login.and.returnValue(of(mockJwt));
        authRepoSpy.getUserByToken.and.returnValue(of(mockUser));

        store.login(mockLoginCredentials);
        store.setTokenDetails(mockJwt.token,mockJwt.expires);
        store.setAccount(mockUser);

        expect(authRepoSpy.login).toHaveBeenCalledWith(mockLoginCredentials);
        expect(authRepoSpy.login).toHaveBeenCalledTimes(1);
        expect(store.authToken()).toBe(mockJwt.token);
        expect(store.expires()).toBe(mockJwt.expires);
        expect(store.user()).toBe(mockUser);
        expect(store.isLoggedIn()).toBe(true);
        expect(store.errorMessage()).toBe(null);
        expect(store.showError()).toBe(false);
        expect(store.loading()).toBe(false);
    });

    it('should get user account by token ', () =>{
        authRepoSpy.getUserByToken.and.returnValue(of(mockUser));

        store.getUserAccount();
        store.setAccount(mockUser);

        expect(authRepoSpy.getUserByToken).toHaveBeenCalled();
        expect(authRepoSpy.getUserByToken).toHaveBeenCalledTimes(1);

        expect(store.user()).toBe(mockUser);
        expect(store.isLoggedIn()).toBe(true);
        expect(store.errorMessage()).toBe(null);
        expect(store.showError()).toBe(false);
        expect(store.loading()).toBe(false);
    });

    it('should verify that it should return computed user ', () =>{
        store.setAccount(mockUser);

        expect(store.getUser()).toBe(mockUser);
    });

    it('should verify that it should return computed user username ', () =>{
        store.setAccount(mockUser);

        expect(store.getUsername()).toBe(mockUser.username);
    });
});