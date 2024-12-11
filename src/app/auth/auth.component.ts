import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone:false,
  template: `
    <div class="auth-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    .auth-container{
      background: linear-gradient(90deg, #C7C5F4, #776BCC);
      min-height: 100vh;
    }
  `
})
export class AuthComponent {

}
