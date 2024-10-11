import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  selectedLanguageIso: string = 'en';

  constructor(private readonly translateService: TranslateService) {}

  changeLanguage(targetLangIso: string): void {
      this.translateService.use(targetLangIso);
      this.selectedLanguageIso = targetLangIso;
  }
}
