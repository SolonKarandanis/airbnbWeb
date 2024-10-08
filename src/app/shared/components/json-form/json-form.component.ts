import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@components/input/input.component';
import { PasswordComponent } from '@components/password/password.component';
import { JsonFormControls, JsonFormData } from '@components/types/types';


@Component({
  selector: 'app-json-form',
  standalone: true,
  imports: [ReactiveFormsModule,InputComponent,PasswordComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      @for(control of jsonFormData.controls; track control.label;){
        @if(control.type=== 'text' || control.type=== 'email' || control.type=== 'tel'||control.type=== 'number'){
          <app-input
            [type]="control.type"
            [for]="control.name + '-input'"
            [placeholder]="control.label"
            [name]="control.name"
            [formControlName]="control.name"
            [control]="form.controls[control.name]"
            [editMode]="form.enabled">
            <span label>{{control.label}}</span>
          </app-input>
        }
        @if(control.type === 'password'){
          <app-password
            [for]="control.name + '-input'"
            [placeholder]="control.label"
            [name]="control.name"
            [formControlName]="control.name"
            [control]="form.controls[control.name]"
            [editMode]="form.enabled">
            <span label>{{control.label}}</span>
          </app-password>
        }
      }
    </form>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonFormComponent implements OnInit,OnChanges{

  protected fb = inject(FormBuilder);
  public form: FormGroup = this.fb.group({});

  @Input()jsonFormData: JsonFormData;

  constructor() {}

  ngOnInit(): void {
    this.createForm(this.jsonFormData.controls);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (!changes.jsonFormData.firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  createForm(controls: JsonFormControls[]){
    for (const control of controls){
      const validatorsToAdd = [];

      for (const [key, value] of Object.entries(control.validators)){
        switch (key){
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }
      
      this.form.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }
  }

  onSubmit() {
    console.log('Form valid: ', this.form.valid);
    console.log('Form values: ', this.form.value);
  }

}
