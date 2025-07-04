import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss']
})
export class Signin {
  signinObj = {
    email: '',
    password: ''
  };

  registerObj = {
    name: '',
    email: '',
    password: ''
  };

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  isLoading = false;

  constructor(private api: ApiService, private router: Router) { }

  ngAfterViewInit(): void {
    const signUpBtn = document.getElementById('sign-up-btn');
    const signInBtn = document.getElementById('sign-in-btn');

    if (signUpBtn && signInBtn) {
      signUpBtn.addEventListener('click', () => {
        this.containerRef.nativeElement.classList.add('sign-up-mode');
      });

      signInBtn.addEventListener('click', () => {
        this.containerRef.nativeElement.classList.remove('sign-up-mode');
      });
    }
  }

  onLogin(): void {
    if (!this.signinObj.email || !this.signinObj.password) {
      alert('Por favor, preencha o e-mail e a senha.');
      return;
    }

    this.isLoading = true;

    this.api.post<{ accessToken: string }>('auth/login', this.signinObj, false)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          if (error.status === 401) {
            alert('Credenciais inválidas.');
          } else {
            alert('Erro ao conectar com o servidor.');
          }
          return throwError(() => error);
        }),
        finalize(() => this.isLoading = false) 
      )
      .subscribe({
        next: (res) => {
          if (res?.accessToken) {
            alert('Login bem-sucedido');
            localStorage.setItem('accessToken', res.accessToken);
            this.router.navigateByUrl('dashboard', { replaceUrl: true });
          } else {
            alert('Erro ao verificar os dados. Tente novamente.');
          }
        },
        error: () => { } 
      });
  }

  onRegister(): void {
    if (!this.registerObj.name || !this.registerObj.email || !this.registerObj.password) {
      alert('Por favor, preencha nome, e-mail e senha.');
      return;
    }

    this.isLoading = true;

    this.api.post<{ message: string }>('users/create/accounts', this.registerObj, false)
      .pipe(
        catchError(error => {
          alert('Erro ao registrar usuário. Tente novamente.');
          return throwError(() => error);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {
          alert(res?.message || 'Cadastro realizado com sucesso!');
          this.containerRef.nativeElement.classList.remove('sign-up-mode');
        },
        error: () => { } 
      });
  }
}
