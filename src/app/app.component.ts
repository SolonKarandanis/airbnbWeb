import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {ToastModule} from "primeng/toast";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {fontAwesomeIcons} from "./shared/font-awesome-icons";
import { FooterComponent } from './protected/layout/footer/footer.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastService } from './protected/layout/toast.service';
import { NavbarComponent } from './protected/layout/navbar/navbar.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './i18n/language.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ButtonModule, 
    FontAwesomeModule, 
    NavbarComponent, 
    FooterComponent, 
    ToastModule
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  private readonly faIconLibrary = inject(FaIconLibrary);
  private readonly toastService = inject(ToastService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly primengConfig = inject(PrimeNGConfig).ripple=true;

  ngOnInit(): void {
    this.initFontAwesome();
    this.listenToastService();
    this.translate.setDefaultLang(this.languageService.selectedLanguageIso);
    this.translate.use(this.languageService.selectedLanguageIso);
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private listenToastService() {
    this.toastService.sendSub.subscribe({
      next: newMessage => {
        if(newMessage && newMessage.summary !== this.toastService.INIT_STATE) {
          this.messageService.add(newMessage);
        }
      }
    })
  }
  
}
