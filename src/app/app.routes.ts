import { Routes } from '@angular/router';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guard/auth-guard';
import { Producer } from './pages/producer/producer';

export const routes: Routes = [
  // Rotas públicas (sem layout)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Signin
  },
  {
    path: 'signup',
    component: Signup
  },

  // Rotas autenticadas (com layout)
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate:[authGuard]
      },
      {
        path: 'producers',
        component: Producer,
        canActivate: [authGuard]
      }
    ]
  }
];
