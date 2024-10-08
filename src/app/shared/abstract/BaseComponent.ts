import {  Directive, HostListener, inject, OnDestroy, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { SubSink } from 'subsink';
import { FormInput } from "./FormInput.interface";
import { FORM_INPUT } from "./formInput.token";
import { TranslateService } from "@ngx-translate/core";

@Directive({
  standalone:true
})
export class BaseComponent implements OnDestroy {

  protected formBuilder = inject(FormBuilder);
  protected translate = inject(TranslateService)

  private _subject: Subject<void> = new Subject<void>();
  public form: FormGroup;
  protected subsink = new SubSink();
  public vm$: Observable<any>;
  public isFormSubmitted=false;

  protected get destroy$(): Observable<void> {
    return this._subject.asObservable();
  }
  // BaseFormField

   @ViewChildren(FORM_INPUT) inputChildren: QueryList<FormInput>;
  // @ViewChildren(SelectComponent) selectChildren: QueryList<SelectComponent>;


  @HostListener('window:beforeunload')
  public ngOnDestroy() {
    this._subject.next();
    this._subject.complete();
    this.subsink.unsubscribe();
  }

  public clear(){
    this.form.reset();
    this.isFormSubmitted=false;
    // this.inputChildren.forEach((input: FormInput) => {
    //   input.clear();
    // });
  }

  public isFormValid(){
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
