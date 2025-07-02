import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
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

  isLoading = false;

  constructor(private http: HttpClient) {}

  onLogin(): void {
    if (!this.signinObj.email || !this.signinObj.password) {
      alert('Por favor, preencha o e-mail e a senha.');
      return;
    }

    this.isLoading = true;

    this.http.post<{ accessToken: string }>(
      'http://127.0.0.1:3000/api/v1/auth/login',
      this.signinObj
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 401) {
          alert('Credenciais inválidas.');
        } else {
          alert('Erro ao conectar com o servidor.');
        }
        return throwError(() => error);
      })
    ).subscribe(res => {
      this.isLoading = false;
      if (res?.accessToken) {
        alert('Login bem-sucedido');
        // Salvar token e redirecionar se quiser
      } else {
        alert('Erro ao verificar os dados. Tente novamente.');
      }
    });
  }

  onRegister(): void {
    if (!this.registerObj.name || !this.registerObj.email || !this.registerObj.password) {
      alert('Por favor, preencha nome, e-mail e senha.');
      return;
    }

    this.isLoading = true;

    this.http.post<{ message: string }>(
      'http://127.0.0.1:3000/api/v1/users/create/accounts',
      this.registerObj
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        alert('Erro ao registrar usuário. Tente novamente.');
        return throwError(() => error);
      })
    ).subscribe(res => {
      this.isLoading = false;
      alert(res?.message || 'Cadastro realizado com sucesso!');
      // Opcional: já mudar para tela de login automaticamente
      this.containerRef.nativeElement.classList.remove('sign-up-mode');
    });
  }
}
