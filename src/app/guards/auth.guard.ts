import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  canActivate(): boolean {
    if (this.pacienteService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
