import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const modules =[
  CommonModule,
]


@Component({
  selector: 'app-form-error',
  standalone:true,
  imports:[
    ...modules
  ],
  template: `
  @if(displayLabels){
    <div *ngIf="displayLabels">
      @for(errorName of errorNames; track errorName){
        <div class="fv-plugins-message-container error">
          <span role="alert">
              {{ errorName }}
          </span>
        </div>
      }
    </div>
  }
    <!-- <ng-container
      [ngTemplateOutlet]="formError"
      [ngTemplateOutletContext]="{
        validation: 'required',
        message: placeholder +' is required',
        control: control
      }"
  ></ng-container>
  <ng-container
      [ngTemplateOutlet]="formError"
      [ngTemplateOutletContext]="{
        validation: 'minlength',
        message: placeholder +' should have at least 3 symbols',
        control: control
      }"
  ></ng-container>
  <ng-template
      #formError
      let-control="control"
      let-message="message"
      let-validation="validation">
      <ng-container
        *ngIf="control && control.hasError(validation) && (control.dirty || control.touched)">
        <div class="fv-plugins-message-container error">
          <span role="alert">
            {{ message }}
          </span>
        </div>
      </ng-container>
    </ng-template> -->
  `,
  styleUrls: ['./form-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormErrorComponent {
  errorNames: string[] = [];
  errors!: ValidationErrors;

@Input() set validationErrors(errors: ValidationErrors | null | undefined) {
    if (errors && Object.keys(errors).length > 0) {
        this.errorNames = Object.keys(errors);
        this.errors = errors;
    }
}

@Input() displayLabels: boolean | undefined = false;

  constructor() { }

}
