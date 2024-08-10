import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import routeConfig from "./routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routeConfig,
      withViewTransitions(),
      withComponentInputBinding()
    )
  ]
};
