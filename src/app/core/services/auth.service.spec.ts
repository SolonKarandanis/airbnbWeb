import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthStore } from "@core/store/auth/auth.store";
import { AuthService } from "./auth.service";

type AuthStore = InstanceType<typeof AuthStore>;

describe('AuthService', () => {
    let service: AuthService;
    let authStoreSpy: jasmine.SpyObj<AuthStore>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(()=>{
        authStoreSpy = jasmine.createSpyObj('AuthStore',[
            'isLoading',
            'isLoggedIn',
            'loggedUser',
            'isJwtExpired',
            'login',
            'logout',
            'getUserAccount',
            'hasAnyAuthority',
            'getUsername',
        ]);

        routerSpy = jasmine.createSpyObj('Router',['navigate']);

        TestBed.configureTestingModule({
            providers:[
              {
                provide: AuthStore,
                useValue: authStoreSpy,
              },
              {
                provide: Router,
                useValue: routerSpy,
              },
            ]
        });

        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});