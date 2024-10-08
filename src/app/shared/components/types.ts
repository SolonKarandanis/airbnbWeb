export type JsonFormInputType = 'text' | 'email' | 'number'|'tel'| 'password';

export type InputType = Extract<JsonFormInputType,'text' | 'email' | 'number'|'tel'>;

interface JsonFormValidators {
    min?: number;
    max?: number;
    required?: boolean;
    requiredTrue?: boolean;
    email?: boolean;
    minLength?: boolean;
    maxLength?: boolean;
    pattern?: string;
    nullValidator?: boolean;
}
interface JsonFormControlOptions {
    min?: string;
    max?: string;
    step?: string;
    icon?: string;
}
export interface JsonFormControls {
    name: string;
    label: string;
    value: string;
    type: JsonFormInputType;
    options?: JsonFormControlOptions;
    required: boolean;
    validators: JsonFormValidators;
}

export interface JsonFormData {
    controls: JsonFormControls[];
}
  