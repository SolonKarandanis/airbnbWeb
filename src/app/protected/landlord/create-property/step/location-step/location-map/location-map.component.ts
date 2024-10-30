import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent, 
  AutoCompleteModule, 
  AutoCompleteSelectEvent
} from "primeng/autocomplete";
import { ToastService } from 'src/app/protected/layout/toast.service';
// import {LeafletModule} from "@asymmetrik/ngx-leaflet";

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [
    // LeafletModule,
    FormsModule,
    AutoCompleteModule
  ],
  template: `
    <p>
      location-map works!
    </p>
  `,
  styles: `
    @import "./../../../../../../assets/scss/airbnb-variables";

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
  // countryService = inject(CountryService);
  toastService = inject(ToastService);

  location = input.required<string>();
  placeholder = input<string>("Select your home country");

  locationChange = output<string>();

}
