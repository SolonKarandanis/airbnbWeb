import { Country } from "@models/country.model";

export type CountryState ={
    readonly loading: boolean,
    readonly errorMessage: string| null;
    readonly showError: boolean;
    readonly countries:Country[];
    readonly selectedCountry:Country | null;
}

export const initialCountryState: CountryState ={
    loading: false,
    errorMessage:null,
    showError:false,
    countries: [],
    selectedCountry:null,
}