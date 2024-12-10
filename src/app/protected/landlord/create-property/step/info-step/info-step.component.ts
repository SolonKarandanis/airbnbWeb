import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { InfoStepControlComponent } from './info-step-control/info-step-control.component';
import { NewListingInfo } from '@models/listing.model';
import { TranslationModule } from '@i18n/translation.module';

export type Control = "GUESTS" | "BEDROOMS" | "BEDS" | "BATHS"

@Component({
  selector: 'app-info-step',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    FontAwesomeModule,
    InfoStepControlComponent,
    TranslationModule,
  ],
  template: `
   <app-info-step-control 
      title='{{ "LANDLORD.CREATE-PROPERTY.INFO.guests" | translate }}'
      [value]="infos().guests.value"
      (valueChange)="onInfoChange($event, 'GUESTS')">
    </app-info-step-control>
    <app-info-step-control 
      title='{{ "LANDLORD.CREATE-PROPERTY.INFO.bedrooms" | translate }}'
      [value]="infos().bedrooms.value"
      (valueChange)="onInfoChange($event, 'BEDROOMS')">
    </app-info-step-control>
    <app-info-step-control 
      title='{{ "LANDLORD.CREATE-PROPERTY.INFO.beds" | translate }}'
      [value]="infos().beds.value"
      (valueChange)="onInfoChange($event, 'BEDS')">
    </app-info-step-control>
    <app-info-step-control 
      title='{{ "LANDLORD.CREATE-PROPERTY.INFO.bathrooms" | translate }}'
      [value]="infos().baths.value"
      (valueChange)="onInfoChange($event, 'BATHS')">
    </app-info-step-control>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoStepComponent {

  public infos = input.required<NewListingInfo>();

  public infoChange = output<NewListingInfo>();
  public stepValidityChange = output<boolean>();

  onInfoChange(newValue: number, valueType: Control) {
    switch (valueType) {
      case "BATHS":
        this.infos().baths = {value: newValue}
        break;
      case "BEDROOMS":
        this.infos().bedrooms = {value: newValue}
        break;
      case "BEDS":
        this.infos().beds = {value: newValue}
        break;
      case "GUESTS":
        this.infos().guests = {value: newValue}
        break
    }

    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validationRules());
  }

  validationRules(): boolean {
    return this.infos().guests.value >= 1;
  }
}
