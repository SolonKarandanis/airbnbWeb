import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../layout/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LandlordService } from '@landlord/service/landlord.service';
import { UserService } from '@user/service/user.service';
import { CategoryStepComponent } from './step/category-step/category-step.component';
import { LocationStepComponent } from './step/location-step/location-step.component';
import { InfoStepComponent } from './step/info-step/info-step.component';
import { PictureStepComponent } from './step/picture-step/picture-step.component';
import { DescriptionStepComponent } from './step/description-step/description-step.component';
import { PriceStepComponent } from './step/price-step/price-step.component';
import { Step } from './step.model';
import { Description, NewListing, NewListingInfo } from '@models/listing.model';
import { NewListingPicture } from '@models/picture.model';
import { CategoryName } from '@models/category.model';
import { PriceVO } from '@models/listing-vo.model';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [
    CategoryStepComponent,
    LocationStepComponent,
    InfoStepComponent,
    PictureStepComponent,
    DescriptionStepComponent,
    PriceStepComponent
  ],
  template: `
    <div class="px-4">
      
    </div>
  `,
  styles: ``
})
export class CreatePropertyComponent {

  private dialogDynamicRef = inject(DynamicDialogRef);
  private listingService = inject(LandlordService);
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  private router = inject(Router);

  steps = this.listingService.initializeSteps();

  currentStep = this.steps[0];

  newListing: NewListing = {
    category: "AMAZING_VIEWS",
    infos: {
      guests: {value: 0},
      bedrooms: {value: 0},
      beds: {value: 0},
      baths: {value: 0}
    },
    location: "",
    description: {
      title: {value: ""},
      description: {value: ""}
    },
    price: {value: 0}
  };

  pictures:NewListingPicture[] = [] 

  nextStep(): void {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  previousStep(): void {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  isAllStepsValid(): boolean {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  onCategoryChange(newCategory: CategoryName): void {
    this.newListing.category = newCategory;
  }

  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }

  onLocationChange(newLocation: string) {
    this.newListing.location = newLocation;
  }

  onInfoChange(newInfo: NewListingInfo) {
    this.newListing.infos = newInfo;
  }

  onPictureChange(newPictures: NewListingPicture[]) {
    this.pictures = newPictures;
  }

  onDescriptionChange(newDescription: Description) {
    this.newListing.description = newDescription;
  }

  onPriceChange(newPrice: PriceVO) {
    this.newListing.price = newPrice;
  }



}
