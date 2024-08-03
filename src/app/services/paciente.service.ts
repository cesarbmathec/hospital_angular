import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from '../interfaces/paciente';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private authUrl = 'http://127.0.0.1:8000/api/token/';
  private pacientesUrl = 'http://127.0.0.1:8000/historias_medicas/paciente/';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<void> {
    return this.http
      .post<{ access: string }>(this.authUrl, { username, password })
      .pipe(
        map((response) => {
          this.token = response.access;
          localStorage.setItem('authToken', this.token); // Guardamos en local storage
        })
      );
  }

  getPacientes(): Observable<Paciente[]> {
    if (!this.token) {
      throw new Error('Token no disponible. Primero autentíquese.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<Paciente[]>(this.pacientesUrl, { headers });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.token = null;
  }
}
