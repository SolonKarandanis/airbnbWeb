import { computed, Injectable } from '@angular/core';
import { GenericService } from '@core/services/generic.service';
import { Country } from '@models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends GenericService{

  private _countries: Country[]=[]
  public countries = computed(()=>this._countries)

  constructor(){
    super()
    // fetch all countries in countries variable
  }

  public getCountryByCode(code: string):void{

  }
}
