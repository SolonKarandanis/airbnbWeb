import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <p>
      home works!
    </p>
    @if(vm(); as vm){
      {{vm.loggedUser?.username}}
    }
  `,
  styles: ``
})
export class HomeComponent {
  private authService = inject(AuthService);

  protected vm = computed(()=>{
    const loggedUser = this.authService.loggedUser();
    return {
      loggedUser
    }
  });


}
