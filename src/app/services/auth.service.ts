import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Token } from '../interfaces/Token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: Token = { access: '', refresh: '' };
  private authenticated = new BehaviorSubject<boolean>(false);

  private apiUrl = environment.authUrl;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token) {
      this.token.access = token;
      this.authenticated.next(true);
    }
    if (refreshToken) {
      this.token.refresh = refreshToken;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  storeTokens(tokens: Token): void {
    localStorage.setItem('authToken', tokens.access ?? '');
    localStorage.setItem('refreshToken', tokens.refresh ?? '');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http
      .post<any>(`${this.apiUrl}refresh`, { refresh: refreshToken })
      .pipe(
        tap((tokens) => this.storeTokens(tokens)),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.authenticated.next(false);
  }

  authenticate(username: string, password: string): Observable<void> {
    return this.http
      .post<Token>(
        this.apiUrl,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          this.token.access = response.access;
          this.token.refresh = response.refresh;
          if (this.token.access)
            localStorage.setItem('authToken', this.token.access);
          if (this.token.refresh)
            localStorage.setItem('refreshToken', this.token.refresh);
          this.authenticated.next(true);
        }),
        catchError((error) => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          this.authenticated.next(false);
          return throwError(
            () =>
              new Error(
                'Error en el inicio de sesión. Por favor, inténtelo de nuevo.' +
                  error.message
              )
          );
        })
      );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }
}
