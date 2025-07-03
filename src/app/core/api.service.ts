import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(withAuth: boolean = true): HttpHeaders {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    if (withAuth) {
      const token = localStorage.getItem('accessToken');
      return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
    }
    return headers;
  }

  get<T>(endpoint: string, withAuth: boolean = true) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(withAuth)
    });
  }

  post<T>(endpoint: string, body: any, withAuth: boolean = true) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers: this.getHeaders(withAuth)
    });
  }

  put<T>(endpoint: string, body: any, withAuth: boolean = true) {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers: this.getHeaders(withAuth)
    });
  }

  delete<T>(endpoint: string, withAuth: boolean = true) {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(withAuth)
    });
  }
}