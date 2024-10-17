import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { UserModel } from '@models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <p>
      home works!
    </p>
    {{user?.username}}
    <!-- @if(vm(); as vm){
      {{vm.loggedUser?.username}}
    } -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  protected user:UserModel| undefined;

  constructor(
    private authService:AuthService
  ){
    this.user =  this.authService.loggedUser();
    effect(()=>{
      this.user
    });
  }


  protected vm = computed(()=>{
    const loggedUser = this.authService.loggedUser();
    return {
      loggedUser
    }
  });


}
