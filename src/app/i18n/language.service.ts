import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';


export interface Locale {
  lang: string;
  data: any;
}


@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  selectedLanguageIso: string = 'en';
  private langIds: any = [];

  constructor(
    private translateService: TranslateService
  ) { }

  changeLanguage(targetLangIso: string): void {
    this.translateService.use(targetLangIso);
    this.selectedLanguageIso = targetLangIso;
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translateService.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translateService.addLangs(this.langIds);
    this.translateService.use(this.getSelectedLanguage());
  }

  setLanguage(lang: string) {
    if (lang) {
      this.translateService.use(this.translateService.getDefaultLang());
      this.translateService.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translateService.getDefaultLang()
    );
  }
}

