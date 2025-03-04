import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimize Change Detection performance
    importProvidersFrom(FormsModule), // FormsModule
    provideRouter(routes), // RouterModule
    provideHttpClient(withInterceptorsFromDi()), // HTTP Client
    importProvidersFrom(ReactiveFormsModule)
  ]
};