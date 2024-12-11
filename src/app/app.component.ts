import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {ToastModule} from "primeng/toast";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {fontAwesomeIcons} from "./shared/font-awesome-icons";
import { MessageService } from 'primeng/api';
// import {PRIME_NG_CONFIG} from 'primeng/config'
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './i18n/language.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ButtonModule, 
    FontAwesomeModule, 
    ToastModule
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  private readonly faIconLibrary = inject(FaIconLibrary);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  // private readonly primengConfig = inject(PRIME_NG_CONFIG).ripple=true;

  ngOnInit(): void {
    this.initFontAwesome();
    this.translate.setDefaultLang(this.languageService.selectedLanguageIso);
    this.translate.use(this.languageService.selectedLanguageIso);
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  
}
