import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authExpired } from './core/interceptors/auth-expired.interceptor';
import { MessageService } from 'primeng/api';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader'
import { firstValueFrom } from 'rxjs';


export const provideTranslation = () => ({
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideStore(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        authExpired
      ]),
      withInterceptorsFromDi(),
    ),
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true,
    },
  ],
};


export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return  new  TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService) {
  return (): Promise<any> => {
      translate.setDefaultLang('en');
      return firstValueFrom(translate.use('en'));
  };
}
