import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { CountryState, initialCountryState } from "./country.state";
import { ErrorResponse } from "@models/error.model";
import { Country } from "@models/country.model";
import { inject } from "@angular/core";
import { CountryRepository } from "@landlord/repository/country.repository";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";

export const CountryStore = signalStore(
    { providedIn: 'root' },
    withDevtools('country'),
    withState<CountryState>(initialCountryState),
    withMethods((state)=>({
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
    withMethods((
        state,
        countryRepo = inject(CountryRepository),
    )=>({
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
    })),
);