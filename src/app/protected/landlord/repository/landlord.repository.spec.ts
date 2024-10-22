import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { LandlordRepository } from "./landlord.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { UtilService } from "@core/services/util.service";

describe('LandlordRepository', () =>{
    let repository: LandlordRepository;
    let httpTesting: HttpTestingController;
    let utilsServiceSpy: jasmine.SpyObj<UtilService>;

    const apiUrl: string = 'landlord';

    beforeEach(() =>{
        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), 
                provideHttpClientTesting(),
                { 
                    provide: UtilService, 
                    useValue: utilsServiceSpy 
                }
            ]
        });

        repository = TestBed.inject(LandlordRepository);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });
});