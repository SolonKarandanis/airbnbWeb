// import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { patchState, signalStore, withMethods, withProps, withState } from "@ngrx/signals";
import { CountryState, initialCountryState } from "./country.state";
import { ErrorResponse } from "@models/error.model";
import { Country } from "@models/country.model";
import { computed, inject, Signal } from "@angular/core";
import { CountryRepository } from "@landlord/repository/country.repository";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";

export const CountryStore = signalStore(
    { providedIn: 'root' },
    // withDevtools('country'),
    withState<CountryState>(initialCountryState),
    withProps(()=>({
        countryRepo:inject(CountryRepository),
    })),
    withMethods((state)=>({
        findCountryByCode: (code: string): Signal<Country> => computed(() => {
            return state.countries().filter(country => country.cca3 === code)[0];
        }),
        setCountries(countries:Country[]){
            patchState(state,{
                countries,
                errorMessage:null,
                showError:false,
                loading:false
            })
        },
        setSelectedCountry(selectedCountry:Country){
            patchState(state,{
                selectedCountry,
                loading:false,
                errorMessage:null,
                showError:false
            });
        },
        setLoading(loading:boolean){
            patchState(state,{loading:loading,showError:false});
        },
        setError(error:ErrorResponse){
            patchState(state,{loading:false,showError:true,errorMessage:'Error'});
        }
    })),
    withMethods((state)=>{
        const countryRepo =state.countryRepo;
        return ({
            getAllCountries: rxMethod<void>(
                pipe(
                    tap(() => {
                        state.setLoading(true)
                    }),
                    switchMap(()=> 
                        countryRepo.getAllCountries().pipe(
                            tapResponse({
                                next:(result)=>{
                                    state.setCountries(result)
                                },
                                error: (error:ErrorResponse) =>{
                                    state.setError(error)
                                }
                            })
                        )
                    )
                )
            ),
            getCountryByCode: rxMethod<string>(
                pipe(
                    tap(() => {
                        state.setLoading(true)
                    }),
                    switchMap((code)=>
                        countryRepo.getCountryByCode(code).pipe(
                            tapResponse({
                                next:(result)=>{
                                    state.setSelectedCountry(result)
                                },
                                error: (error:ErrorResponse) =>{
                                    state.setError(error)
                                }
                            })
                        )
                    )
                )
            ),
        })
    }),
);