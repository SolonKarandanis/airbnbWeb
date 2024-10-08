import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SubSink } from 'subsink';


@Directive({
  standalone:true
})
export abstract class BaseFormField implements OnDestroy,ControlValueAccessor, Validator{
  @Input() hidden=false;
  @Input() control:AbstractControl;
  @Input() editMode= false;
  @Input() fetchingData = false;

  @Input()
  @HostBinding('attr.data-state')
  state: 'active' | 'disabled' | 'regular' = 'regular';

  private _onChange: () => void;
  value!: string;
  onChange!: (value: string) => void;
  onTouched!: () => void;
  private subsink = new SubSink();
  protected cd = inject(ChangeDetectorRef)
  // private component:any;
  

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public clear():void{
    // this.inputForm.reset();
  }

  // Value accessor interface
  writeValue(val: any): void {
    // every time the form control is
    // being updated from the parent
    // tslint:disable-next-line: no-unused-expression
    this.value = val;
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    // when we want to let the parent
    // know that the value of the
    // form control should be updated
    // call `fn` callback
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // when we want to let the parent
    // know that the form control
    // has been touched
    // call `fn` callback
    this.onTouched = fn;
  }
  //TODO: disabled and validate?
  setDisabledState?(isDisabled: boolean): void {
    // when the parent updates the
    // state of the form control
    isDisabled ? this.control?.disable() : this.control?.enable();
  }

  // Validator interface
  validate(control: AbstractControl): ValidationErrors | null{
    // return this.inputForm.valid ? null : { invalidForm: {valid: false, message: 'inputForm fields are invalid'}};
    return null
  }
  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }

}
