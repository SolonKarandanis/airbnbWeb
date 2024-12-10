import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslationModule } from '@i18n/translation.module';
import { Description } from '@models/listing.model';
import { InputTextModule } from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea'

@Component({
  selector: 'app-description-step',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    TranslationModule,
  ],
  template: `
    <div class="mb-3">
      <h1 class="mb-1">{{ "LANDLORD.CREATE-PROPERTY.DESCRIPTION.title" | translate }}</h1>
      <h2 class="mt-0">{{ "LANDLORD.CREATE-PROPERTY.DESCRIPTION.info" | translate }}</h2>
      <form #formDescription="ngForm" novalidate class="w-full">
        <input #titleInput="ngModel" name="title" placeholder='{{ "LANDLORD.PLACEHOLDERS.title" | translate }}' required
          class="w-full p-inputtext-lg" type="text" pInputText
          [ngModel]="description().title.value" (ngModelChange)="onTitleChange($event)"/>

        @if (titleInput.dirty && titleInput.invalid) {
          <small id="title-required" class="text-primary">{{ "GLOBAL.FORMS.ERRORS.required" | translate }}</small>
        } @else {
          <div class="placeholder-validation"></div>
        }

        <textarea #descriptionInput="ngModel" name="description"
          class="w-full mt-2" required placeholder='{{ "LANDLORD.PLACEHOLDERS.summary" | translate }}' rows="5" cols="30"
          pInputTextarea [ngModel]="description().description.value"
          (ngModelChange)="onDescriptionChange($event)"></textarea>

        @if (descriptionInput.dirty && descriptionInput.invalid) {
          <small id="description-required" class="text-primary">{{ "GLOBAL.FORMS.ERRORS.required" | translate }}</small>
        } @else {
          <div class="placeholder-validation"></div>
        }

      </form>
    </div>
  `,
  styles: `
    .placeholder-validation {
      height: 21px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionStepComponent {

  public description = input.required<Description>();

  public descriptionChange =output<Description>();
  public stepValidityChange = output<boolean>();

  formDescription = viewChild(NgForm); 

  onTitleChange(newTitle: string) {
    this.description().title = {value: newTitle};
    this.descriptionChange.emit(this.description());
    this.stepValidityChange.emit(this.validateForm());
  }

  onDescriptionChange(newDescription: string) {
    this.description().description = {value: newDescription};
    this.descriptionChange.emit(this.description());
    this.stepValidityChange.emit(this.validateForm());
  }

  private validateForm(): boolean {
    if (this.formDescription) {
      return this.formDescription()?.valid!;
    } else {
      return false;
    }
  }

}
