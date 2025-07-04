import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';  // importando withRouterConfig
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/auth.interceptor';
import { ApiService } from './core/api.service';
import { DashboardService } from './pages/dashboard/store/dashboard.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Usando withRouterConfig para customizar o roteamento
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),  
    provideHttpClient(withInterceptors([AuthInterceptor])),
    ApiService,
    DashboardService,
  ]
};
