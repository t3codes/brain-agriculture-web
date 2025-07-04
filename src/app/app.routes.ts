import { Routes } from '@angular/router';
import { authGuard, NoAuthGuard } from './guard/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin/signin').then(m => m.Signin),
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout').then(m => m.Layout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard],
      },
      {
        path: 'producers',
        loadComponent: () => import('./pages/producer/producer').then(m => m.Producer),
        canActivate: [authGuard],
      }
    ]
  }
];
