import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from '@i18n/translation.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    FontAwesomeModule,
    TranslationModule,
  ],
  template: `
  <div class="footer text-sm border-solid border-1 border-200 flex
    justify-content-start align-items-center px-6 py-5">
    <span>© 2024 Solon, Inc.</span>
    <fa-icon icon="circle"></fa-icon>
    <span>{{ "FOOTER.LABELS.terms" | translate }}</span>
    <fa-icon icon="circle"></fa-icon>
    <span>{{ "FOOTER.LABELS.sitemap" | translate }}</span>
    <fa-icon icon="circle"></fa-icon>
    <span>{{ "FOOTER.LABELS.privacy" | translate }}</span>
    <fa-icon icon="circle"></fa-icon>
    <span>{{ "FOOTER.LABELS.privacy-choices" | translate }}</span>
  </div>
  `,
  styles: `
  @import "./../../../../assets/scss/airbnb-variables";
  
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
