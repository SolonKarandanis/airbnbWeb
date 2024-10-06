import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
  ],
  template: `
   <app-navbar></app-navbar>
    <div class="grid grid-nogutter mb-5" [class.mx-8]="isListingView">
      <div class="col mt-5">
        <router-outlet></router-outlet>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: ``
})
export class LayoutComponent {
  isListingView = true;

}
