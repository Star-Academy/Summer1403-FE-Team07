import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from "@angular/router";
import routeConfig from "./app/routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routeConfig,
      withViewTransitions(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ), provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
    )
  ]
}).catch((err) => console.error(err));
