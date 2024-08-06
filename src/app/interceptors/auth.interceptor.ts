import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired, attempt to refresh
          return this.authService.refreshToken().pipe(
            switchMap((tokens: { access: string; refresh: string }) => {
              // Retry the failed request with the new token
              const newAccessToken = tokens.access;
              const newAuthReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${newAccessToken}`
                ),
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              // If refresh also fails, clear tokens and redirect to login
              this.authService.logout();
              // Here you can redirect to the login page
              return throwError(err);
            })
          );
        }

        return throwError(error);
      })
    );
  }
}
