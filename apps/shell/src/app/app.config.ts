import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideCheckNoChangesConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { APP_ROUTES } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(APP_ROUTES,
      withComponentInputBinding(),
    ),
    provideCheckNoChangesConfig({
      exhaustive: true,
      interval: 3_000
    }),
  ]
};
