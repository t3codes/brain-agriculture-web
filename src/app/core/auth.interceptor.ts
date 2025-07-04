// src/app/core/auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Remove o token inválido
        localStorage.removeItem('accessToken');
        
        // Exibe um alerta (ou pode usar um serviço de toast/snackbar)
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        
        // Redireciona para a página de login
        router.navigateByUrl('/signin');
      }
      return throwError(() => error);
    })
  );
};