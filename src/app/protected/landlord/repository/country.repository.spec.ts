import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { CountryRepository } from "./country.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { Country } from "@models/country.model";
import { mockCountry } from "src/app/testing/mockData";

describe('CountryRepository', () =>{
    let repository: CountryRepository;
    let httpTesting: HttpTestingController;

    beforeEach(() =>{
        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), 
                provideHttpClientTesting()
            ]
        });

        repository = TestBed.inject(CountryRepository);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });

    it('should get all countries', () =>{
        repository.getAllCountries().subscribe({
            next: (result: Country[]) => {
                expect(result).toBeTruthy();
                expect(Array.isArray(result)).toBeTrue();
                expect(result[0]).toEqual(mockCountry);
            },
        });

        const req = httpTesting.expectOne(`/assets/countries.json`, 'Request to get all countries');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(0);

        req.flush([mockCountry]);
    });

    it('should get a country by code', () =>{
        const code = "test";
        repository.getCountryByCode(code).subscribe({
            next: (result: Country) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockCountry);
            },
        });

        const req = httpTesting.expectOne(`/assets/countries.json`, 'Request to get a country by code');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(0);

        req.flush(mockCountry);
    });
});