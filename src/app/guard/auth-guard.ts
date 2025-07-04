import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localData = localStorage.getItem("accessToken");
   console.log('authGuard - Token:', localData);
  if(localData != null){
    return true;
  } else {
    router.navigateByUrl('login');
    return false;
  }
};




@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
     console.log('NoauthGuard - Token:', token);
    if (token) {
      this.router.navigateByUrl('dashboard');
      return false;
    }
    return true;
  }
}
