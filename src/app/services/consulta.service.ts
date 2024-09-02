import { Injectable } from '@angular/core';
import { Token } from '../interfaces/Token';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { Consulta } from '../interfaces/Consulta';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  private consultaUrl = environment.consultaUrl;
  private token: Token = {
    access: null,
    refresh: null,
  };

  // Inyectamos el servicio para peticiones Http, y el servicio de autenticación
  constructor(private http: HttpClient, private authService: AuthService) {
    this.token.access = this.authService.getAccessToken();
    this.token.refresh = this.authService.getRefreshToken();
  }

  public addConsulta(consulta: Consulta): Observable<boolean> {
    if (this.token.access) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token.access}`,
      });

      return this.http.post<any>(this.consultaUrl, consulta, { headers }).pipe(
        map(() => true), // Si la solicitud es exitosa, retorna true
        catchError((error) => {
          // Maneja el error y retorna false
          if (error.status === 401) {
            // Token expirado o inválido, redirigir al login
            this.authService.logout();
          }
          return new BehaviorSubject<boolean>(false).asObservable();
        })
      );
    }
    return new BehaviorSubject<boolean>(false).asObservable();
  }
}
