import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authExpired } from './core/interceptors/auth-expired.interceptor';
import { MessageService } from 'primeng/api';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader'
import { firstValueFrom } from 'rxjs';
import { httpError } from './core/interceptors/http-error.interceptor';
import { ErrorService } from './core/services/error.service';
import { BaseUrlInterceptor } from '@core/interceptors/base-url.interceptor';
import { LanguageInterceptor } from '@core/interceptors/language.interceptor';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';


export const provideTranslation = () => ({
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpBackend],
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ErrorService,
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideStore(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: Lara,
      }
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
    },
    provideHttpClient(
      withInterceptors([
        httpError,
        authExpired,
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


export function createTranslateLoader(httpHandler: HttpBackend): TranslateHttpLoader {
  return  new  TranslateHttpLoader(new HttpClient(httpHandler), './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService) {
  return (): Promise<any> => {
      translate.setDefaultLang('en');
      return firstValueFrom(translate.use('en'));
  };
}
