import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
  <div class="footer text-sm border-solid border-1 border-200 flex
    justify-content-start align-items-center px-6 py-5">
    <span>© 2024 Codecake, Inc.</span>
    <fa-icon icon="circle"></fa-icon>
    <span>Terms</span>
    <fa-icon icon="circle"></fa-icon>
    <span>Sitemap</span>
    <fa-icon icon="circle"></fa-icon>
    <span>Privacy</span>
    <fa-icon icon="circle"></fa-icon>
    <span>Your privacy choices</span>
  </div>
  `,
  styles: `
  @import "./../../../assets/scss/airbnb-variables";
  
  .footer {
    background-color: $footerBgColor;
  }

  fa-icon {
    margin-left: 10px;
    font-size: 3px;
    margin-right: 10px;
  }
  `
})
export class FooterComponent {

}
