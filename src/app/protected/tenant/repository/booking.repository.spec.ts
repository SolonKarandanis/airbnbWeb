import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { BookingRepository } from "./booking.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { mockBooking, mockCreateBookingRequest } from "src/app/testing/mockData";
import { Booking } from "@models/booking.model";

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

    it('should create a booking', () =>{
        repository.createBooking(mockCreateBookingRequest).subscribe({
            next: (result: Booking) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockBooking);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}`, 'Request to create a booking');

        expect(req.request.method).toBe('POST');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toEqual(mockCreateBookingRequest);

        req.flush(mockBooking);
    });
});