import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { UtilService } from '@core/services/util.service';

@Directive({
  selector: 'input[type=email]',
  standalone: true
})
export class EmailDirective implements Validator{

  constructor(
    private utilService:UtilService
  ) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value.match(this.utilService.emailRegex) ? null : {
      email: true,
    };
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

}
