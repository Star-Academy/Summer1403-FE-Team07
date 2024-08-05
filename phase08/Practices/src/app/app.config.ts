import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import routeConfig from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    routeConfig,
  ],
};
