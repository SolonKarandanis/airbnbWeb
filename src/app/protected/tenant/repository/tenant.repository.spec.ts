import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TenantRepository } from "./tenant.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";

describe('TenantRepository', ()=>{
    let repository: TenantRepository;
    let httpTesting: HttpTestingController;

    const apiUrl: string = 'tenant';

    beforeEach(() =>{
        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), 
                provideHttpClientTesting()
            ]
        });

        repository = TestBed.inject(TenantRepository);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });
});