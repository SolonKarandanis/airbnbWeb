import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
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
