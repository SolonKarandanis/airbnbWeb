import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { BookingRepository } from "./booking.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { mockBookedDates, mockBookedListing, mockBooking, mockCreateBookingRequest } from "src/app/testing/mockData";
import { BookedDates, BookedListing, Booking } from "@models/booking.model";

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

    it('should check availability', () =>{
        const listingPublicId = "test";
        repository.checkAvailability(listingPublicId).subscribe({
            next: (result: BookedDates[]) => {
                expect(result).toBeTruthy();
                expect(Array.isArray(result)).toBeTrue();
                expect(result[0]).toEqual(mockBookedDates);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/check-availability?listingPublicId=${listingPublicId}`, 'Request to check availability');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(1);
        expect(req.request.params.get('listingPublicId')).toBe(listingPublicId);

        req.flush([mockBookedDates]);
    });

    it('should get tenant booked listings', () =>{
        repository.getTenantBookedListings().subscribe({
            next: (result: BookedListing[]) => {
                expect(result).toBeTruthy();
                expect(Array.isArray(result)).toBeTrue();
                expect(result[0]).toEqual(mockBookedListing);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/tenant/booked-listings`, 'Request to get tenant booked listings');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(0);

        req.flush([mockBookedListing]);
    });

    it('should get landlord booked listings', () =>{
        repository.getLandlordBookedListings().subscribe({
            next: (result: BookedListing[]) => {
                expect(result).toBeTruthy();
                expect(Array.isArray(result)).toBeTrue();
                expect(result[0]).toEqual(mockBookedListing);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/landlord/booked-listings`, 'Request to get landlord booked listings');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(0);

        req.flush([mockBookedListing]);
    });

    it('should cancel a booking (landlord)', () =>{
        const bookingPublicId = "test";
        const listingPublicId = "test";
        const byLandlord = true;

        repository.cancelBooking(bookingPublicId,listingPublicId,byLandlord).subscribe();

        const req = httpTesting
            .expectOne(`${apiUrl}?bookingPublicId=${bookingPublicId}&listingPublicId=${listingPublicId}&byLandlord=${byLandlord}`, 
                'Request to cancel a booking (landlord)');

        expect(req.request.method).toBe('DELETE');
        expect(req.request.params.keys().length).toBe(3);
        expect(req.request.params.get('bookingPublicId')).toBe(bookingPublicId);
        expect(req.request.params.get('listingPublicId')).toBe(listingPublicId);
        expect(req.request.params.get('byLandlord')).toBe('true');

        req.flush(null);
    });

    it('should cancel a booking (tenant)', () =>{
        const bookingPublicId = "test";
        const listingPublicId = "test";
        const byLandlord = false;

        repository.cancelBooking(bookingPublicId,listingPublicId,byLandlord).subscribe();

        const req = httpTesting
            .expectOne(`${apiUrl}?bookingPublicId=${bookingPublicId}&listingPublicId=${listingPublicId}&byLandlord=${byLandlord}`, 
                'Request to cancel a booking (landlord)');

        expect(req.request.method).toBe('DELETE');
        expect(req.request.params.keys().length).toBe(3);
        expect(req.request.params.get('bookingPublicId')).toBe(bookingPublicId);
        expect(req.request.params.get('listingPublicId')).toBe(listingPublicId);
        expect(req.request.params.get('byLandlord')).toBe('false');

        req.flush(null);
    });
});