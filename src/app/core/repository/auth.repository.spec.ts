import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthRepository } from "./auth.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";

describe('AuthRepository', () =>{
    let repository: AuthRepository;
    let httpTesting: HttpTestingController;

    beforeEach(() =>{

        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), 
                provideHttpClientTesting()
            ]
        });

        repository = TestBed.inject(AuthRepository);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });
});