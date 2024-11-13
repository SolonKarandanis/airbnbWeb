import {  Directive,inject, QueryList, ViewChildren } from "@angular/core";
import {  FormControl, FormGroup } from "@angular/forms";
import { FormInput } from "./FormInput.interface";
import { FORM_INPUT } from "./formInput.token";
import { TranslateService } from "@ngx-translate/core";

@Directive({
  standalone:true
})
export class BaseComponent  {

  protected translate = inject(TranslateService)

  protected form!: FormGroup;
  protected isFormSubmitted=false;

  // BaseFormField

   @ViewChildren(FORM_INPUT) inputChildren!: QueryList<FormInput>;
  // @ViewChildren(SelectComponent) selectChildren: QueryList<SelectComponent>;

  protected get controls() {
    return this.form.controls;
  }


  protected clear(){
    this.form.reset();
    this.isFormSubmitted=false;
    // this.inputChildren.forEach((input: FormInput) => {
    //   input.clear();
    // });
  }

  protected isFormValid(){
    return this.isFormSubmitted || !this.form?.dirty
  }

  protected isFieldValid(field: string): boolean | undefined {
    const control = this.form.get(field);
    return (!control?.valid && control?.touched) || (control?.untouched && this.isFormSubmitted);
  }

  protected validateAllFormFields() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields();
      }
    });
  }
}
