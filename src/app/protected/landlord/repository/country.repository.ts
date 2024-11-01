import { Injectable } from "@angular/core";
import { BaseRepository } from "@core/repository/base.repository";
import { Country } from "@models/country.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CountryRepository  extends BaseRepository{

    /**
    * Get all the Countries
    * @returns An observable with the Countries
    */
    public getAllCountries():Observable<Country[]>{
        return this.http.get<Country[]>(`assets/countries.json`);
    }

    /**
    * Get country by country code
    * @param code The country's code
    * @returns An observable with the Country
    */
    public getCountryByCode(code: string): Observable<Country>{
        return this.http.get<Country>(`assets/countries.json`);
    }
}