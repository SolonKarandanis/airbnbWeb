import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
    factory: (): string => environment.webApiEndpointLocal,
    providedIn: 'root',
});

