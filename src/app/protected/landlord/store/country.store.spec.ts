import { CountryRepository } from "@landlord/repository/country.repository";
import { CountryStore } from "./country.store";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { mockCountry } from "src/app/testing/mockData";

type CountryStore = InstanceType<typeof CountryStore>;

describe('CountryStore', () =>{
    let store: CountryStore;
    let countryRepoSpy: jasmine.SpyObj<CountryRepository>;

    beforeEach(()=>{
        countryRepoSpy = jasmine.createSpyObj('CountryRepository',[
            'getAllCountries',
            'getCountryByCode',
        ]);

        TestBed.configureTestingModule({
            providers:[
              {
                provide: CountryRepository,
                useValue: countryRepoSpy,
              },
            ]
        });

        store = TestBed.inject(CountryStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should get all countries ', () =>{
        countryRepoSpy.getAllCountries.and.returnValue(of([mockCountry]));

        store.getAllCountries();

        expect(countryRepoSpy.getAllCountries).toHaveBeenCalled();
        expect(countryRepoSpy.getAllCountries).toHaveBeenCalledTimes(1);
    });

    it('should get a country by code', () =>{
        const code = "test";
        countryRepoSpy.getCountryByCode.and.returnValue(of(mockCountry));

        store.getCountryByCode(code);


        expect(countryRepoSpy.getCountryByCode).toHaveBeenCalledWith(code);
        expect(countryRepoSpy.getCountryByCode).toHaveBeenCalledTimes(1);
    });

    it('should set countries', () =>{
        const results = [mockCountry];
        store.setCountries(results);

        expect(store.countries()).toBe(results);
        expect(store.errorMessage()).toBe(null);
        expect(store.showError()).toBe(false);
        expect(store.loading()).toBe(false);
    });

    it('should set selected country', () =>{
        store.setSelectedCountry(mockCountry);

        expect(store.selectedCountry()).toBe(mockCountry);
        expect(store.errorMessage()).toBe(null);
        expect(store.showError()).toBe(false);
        expect(store.loading()).toBe(false);
    });
});