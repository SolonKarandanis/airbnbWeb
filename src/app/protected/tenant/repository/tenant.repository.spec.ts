import { CategoryName } from '@models/category.model';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TenantRepository } from "./tenant.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { mockCardListing, mockPaging } from "src/app/testing/mockData";
import { SearchResult } from '@models/search.model';
import { CardListing } from '@models/listing.model';

describe('TenantRepository', ()=>{
    let repository: TenantRepository;
    let httpTesting: HttpTestingController;
    let searchResult: SearchResult<any>;

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

        searchResult = {
            countRows: 1,
            list: [],
        };
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });

    it('should get listings by booking and category', () =>{
        const paging=mockPaging;
        const catname="ALL";

        repository.getAllListingsByBookingAndCategory(catname,paging).subscribe({
            next: (results: SearchResult<CardListing>) => {
                expect(results).toBeTruthy();
                expect(results).toEqual(searchResult);
                expect(Array.isArray(results.list)).toBeTrue();
                expect(results.list[0]).toEqual(mockCardListing);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/listing/by-category?category=${catname}&page=${paging.page}&size=${paging.limit}`, 'Request to search users');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(3);
        expect(req.request.params.get('category')).toBe(catname);
        expect(req.request.params.get('page')).toBe(String(paging.page));
        expect(req.request.params.get('size')).toBe(String(paging.limit));


        searchResult.list = [mockCardListing];

        req.flush(searchResult);

    });
});