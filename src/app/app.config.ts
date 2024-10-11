import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authExpired } from './core/services/auth-expired.interceptor';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader'
import { firstValueFrom } from 'rxjs';

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
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true,
    },
  ]
};

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export function appInitializerFactory(translate: TranslateService) {
  return (): Promise<any> => {
      translate.setDefaultLang('en');
      return firstValueFrom(translate.use('en'));
  };
}
