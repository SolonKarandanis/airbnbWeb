import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { LocationMapComponent } from '@landlord/create-property/step/location-step/location-map/location-map.component';
import { FooterStepComponent } from '@shared/footer-step/footer-step.component';
import { SearchDateComponent } from './search-date/search-date.component';
import { InfoStepComponent } from '@landlord/create-property/step/info-step/info-step.component';
import { Step } from '@landlord/create-property/step.model';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewListingInfo } from '@models/listing.model';
import { BookedDates } from '@models/booking.model';
import { TenantService } from '@tenant/service/tenant.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    LocationMapComponent,
    FooterStepComponent,
    SearchDateComponent,
    InfoStepComponent
  ],
  template: `
    <div class="px-4 mb-3">
      @switch (this.currentStep.id){
        @case (LOCATION) {
          <h1>Where do you want to go?</h1>
          <!-- <app-location-map 
            [location]="newSearch.location"
            [placeholder]="'Choose your country'"
            (locationChange)="onNewLocation($event)"></app-location-map> -->
        }
        @case (DATES){
          <h1>When do you want to go?</h1>
          <!-- <app-search-date 
            [dates]="newSearch.dates"
            (datesChange)="onNewDate($event)"
            (stepValidityChange)="onValidityChange($event)">
          </app-search-date> -->
        }
        @case (GUESTS){
          <h1 class="mb-1">What are you looking for?</h1>
          <h2 class="mt-0">Number of beds, guests, etc.</h2>
          <!-- <app-info-step 
            [infos]="newSearch.infos"
            (infoChange)="onInfoChange($event)"
            (stepValidityChange)="onValidityChange($event)"></app-info-step> -->
        }
      }
    </div>
    <app-footer-step 
      [currentStep]="currentStep"
      [isAllStepsValid]="isAllStepsValid()"
      [loading]="loading()"
      (finish)="search()"
      (next)="nextStep()"
      (previous)="previousStep()">
    </app-footer-step>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

  private dialogDynamicRef = inject(DynamicDialogRef);
  private router = inject(Router);
  private tenantService = inject(TenantService);

  loading:Signal<boolean> = this.tenantService.isLoading;

  LOCATION = "location";
  DATES = "dates";
  GUESTS = "guests";

  steps: Step[] = [
    {
      id: this.LOCATION,
      idNext: this.DATES,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.DATES,
      idNext: this.GUESTS,
      idPrevious: this.LOCATION,
      isValid: false
    },
    {
      id: this.GUESTS,
      idNext: null,
      idPrevious: this.DATES,
      isValid: false
    }
  ];

  currentStep = this.steps[0];

  // newSearch: Search = {
  //   dates: {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //   },
  //   infos: {
  //     guests: {value: 0},
  //     bedrooms: {value: 0},
  //     beds: {value: 0},
  //     baths: {value: 0}
  //   },
  //   location: ""
  // };

  nextStep() {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  previousStep() {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  isAllStepsValid() {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }

  onNewLocation(newLocation: string): void {
    this.currentStep.isValid = true;
    // this.newSearch.location = newLocation;
  }

  onNewDate(newDates: BookedDates) {
    // this.newSearch.dates =  newDates
  }

  onInfoChange(newInfo: NewListingInfo) {
    // this.newSearch.infos = newInfo;
  }

  search() {
    // this.loadingSearch = false;
    // this.router.navigate(["/"],
    //   {
    //     queryParams: {
    //       location: this.newSearch.location,
    //       guests: this.newSearch.infos.guests.value,
    //       bedrooms: this.newSearch.infos.bedrooms.value,
    //       beds: this.newSearch.infos.beds.value,
    //       baths: this.newSearch.infos.baths.value,
    //       startDate: dayjs(this.newSearch.dates.startDate).format("YYYY-MM-DD"),
    //       endDate: dayjs(this.newSearch.dates.endDate).format("YYYY-MM-DD"),
    //     }
    //   });
    // this.dialogDynamicRef.close();
  }

}

export interface Search {
  location: string,
  dates: BookedDates,
  infos: NewListingInfo
}
