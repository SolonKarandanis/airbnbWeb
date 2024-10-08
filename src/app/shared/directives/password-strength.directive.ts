import { Directive, HostListener, InjectionToken, Input, inject } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';


type PasswordStrength = 'weak' | 'medium' | 'strong';

type PasswordEvaluatorFn = (password: string) => PasswordStrength;

export const evaluatorFnToken = new InjectionToken<
  PasswordEvaluatorFn
>(
  'PasswordEvaluatorFn',
);

export function providePasswordEvaluatorFn(
  evaluatorFn: PasswordEvaluatorFn,
) {
  return [{
    provide: evaluatorFnToken,
    useValue: evaluatorFn,
  }];
}




@Directive({
  selector: 'input[type="password"]',
  standalone: true,
  exportAs: 'passwordStrength',
})
export class PasswordStrengthDirective {
  @Input() evaluatorFn = inject(evaluatorFnToken,{ optional: true }) ?? this.defaultEvaluatorFn;
  // <input type="password" [noStrengthCheck]="true">
  @Input() noStrengthCheck = false;
  // property to capture in the template
  strength: PasswordStrength = 'weak'; 
  private readonly utilService= inject(UtilService);

  @HostListener('input', ['$event'])
  onInput(event: InputEvent){
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (this.noStrengthCheck) {
      return;
    }
    this.strength = this.evaluatorFn(value);
  }

  private defaultEvaluatorFn(password: string):PasswordStrength{
    if (password.length < 6) {
      return 'weak';
    } else if (password.length < 10) {
        return 'medium';
    }
    return 'strong';
  }

}
// bootstrapApplication(AppComponent, {
//   providers: [
//     providePasswordEvaluatorFn((password: string) => {
//       if (password.length < 6) {
//         return 'weak';
//       } else if (password.length < 10) {
//         return 'medium';
//       }
//       return 'strong';
//     }),
//   ],
//   // the rest of the application
// });