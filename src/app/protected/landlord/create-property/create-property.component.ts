import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LandlordService } from '@landlord/service/landlord.service';
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
import { FooterStepComponent } from '@shared/footer-step/footer-step.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [
    CategoryStepComponent,
    LocationStepComponent,
    InfoStepComponent,
    PictureStepComponent,
    DescriptionStepComponent,
    PriceStepComponent,
    FooterStepComponent,
  ],
  template: `
    <div class="px-4">
      @switch (this.currentStep.id){
        @case (listingService.CATEGORY) {
          <app-category-step [categoryName]="newListing.category"
            (categoryChange)="onCategoryChange($event)"
            (stepValidityChange)="onValidityChange($event)"></app-category-step>
        }
        @case (listingService.LOCATION) {
          <app-location-step [location]="newListing.location"
            (locationChange)="onLocationChange($event)"
            (stepValidityChange)="onValidityChange($event)">

          </app-location-step>
        }
        @case (listingService.INFO){
          <div class="mb-5">
            <h1 class="mb-1">Share some basics about your place</h1>
            <h2 class="mt-0">You'll add more details later, like bed types.</h2>
            <app-info-step [infos]="newListing.infos"
              (infoChange)="onInfoChange($event)"
              (stepValidityChange)="onValidityChange($event)"></app-info-step>
          </div>
        }
        @case (listingService.PHOTOS){
          <app-picture-step [pictures]="pictures"
            (picturesChange)="onPictureChange($event)"
            (stepValidityChange)="onValidityChange($event)"></app-picture-step>
        }
        @case (listingService.DESCRIPTION){
          <app-description-step [description]="newListing.description"
            (descriptionChange)="onDescriptionChange($event)"
            (stepValidityChange)="onValidityChange($event)"></app-description-step>
        }
        @case (listingService.PRICE){
          <app-price-step [price]="newListing.price"
            (priceChange)="onPriceChange($event)"
            (stepValidityChange)="onValidityChange($event)"></app-price-step>
        }
      }
    </div>
    <app-footer-step 
      [currentStep]="currentStep"
      [isAllStepsValid]="isAllStepsValid()"
      [loading]="listingService.isLoading()"
      (finish)="createListing()"
      (next)="nextStep()"
      (previous)="previousStep()">
    </app-footer-step>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePropertyComponent {

  private dialogDynamicRef = inject(DynamicDialogRef);

  protected listingService = inject(LandlordService);

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

  constructor(){
    this.listenToSuccessfullCreation();
  }

  createListing(): void{
    this.listingService.executeCreateListing(this.pictures,this.newListing);
  }

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

  private listenToSuccessfullCreation() {
    effect(() => {
      const publicId = this.listingService.createdListingPublicId();
      if (publicId) {
        this.dialogDynamicRef.close(publicId);
        this.navigateToProperties();
      } 
    });
  }

  private navigateToProperties():void{
    this.router.navigate(["landlord", "properties"]);
  }


}
