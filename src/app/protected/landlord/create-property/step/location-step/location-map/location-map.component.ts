import { Component, effect, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent, 
  AutoCompleteModule, 
  AutoCompleteSelectEvent
} from "primeng/autocomplete";
import { ToastService } from 'src/app/protected/layout/toast.service';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import L, {circle, latLng, polygon, tileLayer} from "leaflet";
import {OpenStreetMapProvider} from "leaflet-geosearch";
import { CountryService } from '@landlord/service/country.service';
import { Country } from '@models/country.model';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [
    LeafletModule,
    FormsModule,
    AutoCompleteModule
  ],
  template: `
    <div class="my-4 flex justify-content-center align-items-center">
    <p-autoComplete
      [styleClass]="'autocomplete-airbnb'"
      [panelStyleClass]="'country-panel'"
      [ngModel]="currentLocation"
      (onSelect)="onLocationChange($event)"
      [suggestions]="filteredCountries"
      (completeMethod)="search($event)"
      [dropdown]="true"
      [optionLabel]="formatLabel"
      [placeholder]="placeholder()"></p-autoComplete>
    </div>
    <div leaflet
      [leafletOptions]="options"
      [leafletLayersControl]="layersControl"
      (leafletMapReady)="onMapReady($event)"
      class="map-location z-0"></div>
  `,
  styles: `
    @import "./../../../../../../../assets/scss/airbnb-variables";

    ::ng-deep .autocomplete-airbnb {
      width: 400px!important;
    }

    ::ng-deep .country-panel {
      width: 350px;
    }

    ::ng-deep .map-location{
      height: calc(45vh);
      .leaflet-geosearch-bar {
        border-radius: 30px!important;
      }

      .leaflet-control-geosearch {
        border-radius: 30px;
        height: 50px;
        font-family: $fontFamily;
        font-size: 1rem;
      }
    }
  `
})
export class LocationMapComponent {
  countryService = inject(CountryService);
  toastService = inject(ToastService);

  location = input.required<string>();
  placeholder = input<string>("Select your home country");

  locationChange = output<string>();

  private map: L.Map | undefined;
  private provider: OpenStreetMapProvider | undefined;

  formatLabel = (country: Country) => country.flag + "   " + country.name.common;

  options = {
    layers: [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 18, attribution: "..."}),
    ],
    zoom: 5,
    center: latLng(46.87996, -121.726909)
  }

  layersControl = {
    baseLayers: {
      "Open Street Map": tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "..."
      }),
    },
    overlays: {
      "Big Circle": circle([46.95, -122], {radius: 5000}),
      "Big square": polygon([[46.8, -121.55], [46.8, -121.55], [46.8, -121.55], [46.8, -121.55]])
    }
  }

  currentLocation: Country | undefined;
  countries: Array<Country> = [];
  filteredCountries: Array<Country> = [];


  constructor() {
    this.listenToLocation();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.configSearchControl();
  }

  private configSearchControl() {
    this.provider = new OpenStreetMapProvider();
  }

  onLocationChange(newEvent: AutoCompleteSelectEvent) {
    const newCountry = newEvent.value as Country;
    this.locationChange.emit(newCountry.cca3);
  }

  private listenToLocation() {
    effect(() => {
      const countries = this.countryService.countries();
      if (countries) {
        this.countries = countries;
        this.filteredCountries = countries;
        this.changeMapLocation(this.location())
      } 
    });
  }

  private changeMapLocation(term: string) {
    this.currentLocation = this.countries.find(country => country.cca3 === term);
    if (this.currentLocation) {
      this.provider!.search({query: this.currentLocation.name.common})
        .then((results) => {
          if (results && results.length > 0) {
            const firstResult = results[0];
            this.map!.setView(new L.LatLng(firstResult.y, firstResult.x), 13);
            L.marker([firstResult.y, firstResult.x])
              .addTo(this.map!)
              .bindPopup(firstResult.label)
              .openPopup();
          }
        })
    }
  }

  search(newCompleteEvent: AutoCompleteCompleteEvent): void {
    this.filteredCountries =
      this.countries.filter(country => country.name.common.toLowerCase().startsWith(newCompleteEvent.query))
  }

  // protected readonly filter = filter;



}
