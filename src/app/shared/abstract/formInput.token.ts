import { forwardRef, InjectionToken } from "@angular/core";
import { FormInput } from "./FormInput.interface";

export const FORM_INPUT = new InjectionToken<FormInput>('FormInput');

export function FORM_INPUT_TOKEN(component: any): any {
  return {
    provide: FORM_INPUT,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}
