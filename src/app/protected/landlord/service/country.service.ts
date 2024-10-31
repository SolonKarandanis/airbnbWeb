import { Injectable } from '@angular/core';
import { GenericService } from '@core/services/generic.service';
import { CountryStore } from '@landlord/store/country.store';
import { Country } from '@models/country.model';

type CountryStore = InstanceType<typeof CountryStore>;

@Injectable({
  providedIn: 'root'
})
export class CountryService extends GenericService{

  public isLoading:boolean;
  public countries:Country[];
  public selectedCountry:Country| null;

  constructor(
    private countryStore:CountryStore,
  ){
    super()
    // fetch all countries in countries variable
    this.isLoading = this.countryStore.loading();
    this.countries=this.countryStore.countries();
    this.selectedCountry=this.countryStore.selectedCountry();
  }

  /**
  * Get all the Countries
  */
  public executeGetAllCountries():void{
    this.countryStore.getAllCountries();
  }

  /**
  * Get country by country code
  */
  public executeGetCountryByCode(code: string):void{
    this.countryStore.getCountryByCode(code);
  }
}
