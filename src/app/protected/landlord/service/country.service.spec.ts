import { TestBed } from '@angular/core/testing';

import { CountryService } from './country.service';
import { CountryStore } from '@landlord/store/country.store';

type CountryStore = InstanceType<typeof CountryStore>;

describe('CountryService', () => {
  let service: CountryService;
  let countryStoreSpy: jasmine.SpyObj<CountryStore>;

  beforeEach(() => {
    countryStoreSpy = jasmine.createSpyObj('CountryStore',[
      'getAllCountries',
      'getCountryByCode',
      'loading',
      'countries',
      'selectedCountry',
    ]);

    TestBed.configureTestingModule({
      providers:[
        {
          provide: CountryStore,
          useValue: countryStoreSpy,
        },
      ]
    });
    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute get a country by code', () =>{
    const code = "test";
    service.executeGetCountryByCode(code);

    expect(countryStoreSpy.getCountryByCode).toHaveBeenCalledWith(code);
    expect(countryStoreSpy.getCountryByCode).toHaveBeenCalledTimes(1);
  });

  it('should execute get all countries', () =>{
    service.executeGetAllCountries();

    expect(countryStoreSpy.getAllCountries).toHaveBeenCalled()
    expect(countryStoreSpy.getAllCountries).toHaveBeenCalledTimes(1);
  });

});
