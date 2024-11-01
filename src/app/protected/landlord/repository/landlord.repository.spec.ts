import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { LandlordRepository } from "./landlord.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { UtilService } from "@core/services/util.service";
import { CardListing, CreatedListing } from "@models/listing.model";
import { mockCardListing, mockCreatedListing, mockNewListing, mockNewListingPicture } from "src/app/testing/mockData";

describe('LandlordRepository', () =>{
    let repository: LandlordRepository;
    let httpTesting: HttpTestingController;
    let utilsServiceSpy: jasmine.SpyObj<UtilService>;

    const apiUrl: string = 'landlord';

    beforeEach(() =>{
        utilsServiceSpy= jasmine.createSpyObj('UtilService',[
            'createJsonBlob',
        ]);

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

    it('should get all listings', () =>{
        repository.getAllListings().subscribe({
            next: (result: CardListing[]) => {
                expect(result).toBeTruthy();
                expect(Array.isArray(result)).toBeTrue();
                expect(result[0]).toEqual(mockCardListing);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/listings`, 'Request to get all listings');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(0);

        req.flush([mockCardListing]);
    });

    it('should delete listing by id', () =>{
        const id ='1';
        repository.deleteListing(id).subscribe();

        const req = httpTesting.expectOne(`${apiUrl}/listings/${id}`, 'Request to delete listing by id');

        expect(req.request.method).toBe('DELETE');
        expect(req.request.params.keys().length).toBe(0);

        req.flush(null);
    });

    it('should create a new listing', () =>{
        const formData = new FormData();
        formData.append("images", mockNewListingPicture.file);

        repository.createListing([mockNewListingPicture],mockNewListing).subscribe({
            next: (result: CreatedListing) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockCreatedListing);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}`, 'Request to create a new listing');

        expect(req.request.method).toBe('POST');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toEqual(formData);

        req.flush(mockCreatedListing);
    });
});