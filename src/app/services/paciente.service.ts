import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Paciente } from '../interfaces/paciente';
import { Token } from '../interfaces/Token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private pacienteUrl = 'http://192.168.0.102:8000/historias_medicas/paciente/';
  private token: Token = {
    access: '',
    refresh: '',
  };

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token.access = this.authService.getAccessToken();
    this.token.refresh = this.authService.getRefreshToken();
  }

  public addPaciente(paciente: Paciente): Observable<boolean> {
    if (this.token.access) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token.access}`,
      });

      return this.http.post<any>(this.pacienteUrl, paciente, { headers }).pipe(
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

  public getPacientes(): Observable<Paciente[]> {
    this.token.access = this.authService.getAccessToken();
    if (!this.token) {
      throw new Error('Token no disponible. Primero autentíquese.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token.access}`,
    });

    return this.http.get<Paciente[]>(this.pacienteUrl, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Token expirado o inválido, redirigir al login
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }

  public deletePaciente(id: number): Observable<boolean> {
    this.token.access = this.authService.getAccessToken();

    if (!this.token.access) {
      return throwError('Token no disponible. Primero autentíquese.').pipe(
        catchError((error) => {
          this.authService.logout();
          return new BehaviorSubject<boolean>(false).asObservable();
        })
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token.access}`,
    });

    const url = `${this.pacienteUrl}${id}/`; // URL para eliminar un paciente específico

    return this.http.delete<any>(url, { headers }).pipe(
      map(() => true), // Si la eliminación es exitosa, retorna true
      catchError((error) => {
        // Maneja los errores y retorna false
        if (error.status === 401) {
          // Token expirado o inválido, redirigir al login
          this.authService.logout();
        }
        return new BehaviorSubject<boolean>(false).asObservable();
      })
    );
  }

  public updatePaciente(paciente: Paciente): Observable<boolean> {
    this.token.access = this.authService.getAccessToken();

    if (!this.token.access) {
      return throwError('Token no disponible. Primero autentíquese.').pipe(
        catchError((error) => {
          this.authService.logout();
          return new BehaviorSubject<boolean>(false).asObservable();
        })
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token.access}`,
    });

    const url = `${this.pacienteUrl}${paciente.id}/`;

    return this.http.put<any>(url, paciente, { headers }).pipe(
      map(() => true),
      catchError((error) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return new BehaviorSubject<boolean>(false).asObservable();
      })
    );
  }

  public getPacienteById(id: number): Observable<Paciente> {
    this.token.access = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token.access}`,
    });

    const url = `${this.pacienteUrl}${id}/`; // URL para obtener un paciente específico

    return this.http.get<Paciente>(url, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
