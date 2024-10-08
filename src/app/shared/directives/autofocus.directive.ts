import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[ktAutofocus]',
  standalone:true
})
export class AutofocusDirective {
  @Input() set autofocus(_: unknown) {
    this.host.nativeElement.focus();
  }

  constructor(private host: ElementRef<HTMLDListElement>) { }

}
