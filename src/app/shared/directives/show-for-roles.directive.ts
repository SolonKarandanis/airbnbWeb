import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Directive({
  selector: '[appShowForRoles]',
  standalone: true
})
export class ShowForRolesDirective {

  constructor(
    private templateRef: TemplateRef<unknown>, 
    private viewContainerRef: ViewContainerRef,
    private authService:AuthService
  ) { }

  @Input() set appShowForRoles(showForRoles: Array<string>){
    const showFor = showForRoles || [];
    if(showFor.length > 0 && this.authService.hasRoles(showFor) ){
      this.viewContainerRef.createEmbeddedView(this.templateRef)
    }
    else{
      this.viewContainerRef.clear()
    }
  }

  // *appShowForRoles ="['','']"
}
