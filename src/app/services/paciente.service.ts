import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Paciente } from '../interfaces/Paciente';
import { Token } from '../interfaces/Token';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private pacienteUrl = environment.pacienteUrl;
  private token: Token = {
    access: null,
    refresh: null,
  };

  // BehaviorSubject para manejar el estado de los pacientes
  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  pacientes$ = this.pacientesSubject.asObservable();

  // Inyectamos el servicio para peticiones Http, y el servicio de autenticación
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
        tap(() => this.getPacientes().subscribe()), // Actualiza la lista después de agregar
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
    // Limpio el BehaviorSubject de la lista de pacientes, sino hago esto me genera un error
    this.pacientesSubject.next([]);

    this.token.access = this.authService.getAccessToken();
    if (!this.token) {
      throw new Error('Token no disponible. Primero autentíquese.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token.access}`,
    });

    return this.http.get<Paciente[]>(this.pacienteUrl, { headers }).pipe(
      tap((data: Paciente[]) => {
        this.pacientesSubject.next(data); // Actualiza el BehaviorSubject con la nueva lista
      }),
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
      tap(() => this.getPacientes().subscribe()), // Actualiza la lista después de agregar
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
      tap(() => this.getPacientes().subscribe()), // Actualiza la lista después de agregar
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
