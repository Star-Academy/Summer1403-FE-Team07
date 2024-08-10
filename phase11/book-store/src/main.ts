import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from "@angular/router";
import routeConfig from "./app/routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routeConfig,
      withViewTransitions(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ), provideAnimationsAsync()
  ]
}).catch((err) => console.error(err));
