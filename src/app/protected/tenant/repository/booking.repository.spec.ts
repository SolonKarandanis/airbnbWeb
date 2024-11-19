import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { BookingRepository } from "./booking.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";

describe('BookingRepository', ()=>{
    let repository: BookingRepository;
    let httpTesting: HttpTestingController;

    const apiUrl: string = 'booking';

    beforeEach(() =>{
        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), 
                provideHttpClientTesting()
            ]
        });

        repository = TestBed.inject(BookingRepository);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });
});