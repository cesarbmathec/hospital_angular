import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { Router, RouterModule } from '@angular/router';
import {
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Paciente } from '../../../interfaces/paciente';
import { AuthService } from '../../../services/auth.service';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBar,
    MatTableModule,
    MatCardModule,
    MatCardHeader,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.scss',
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading: boolean = false;

  displayedColumns: string[] = ['id', 'nombre', 'cedula_identidad', 'actions'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (this.authService.isAuthenticated()) {
      this.pacienteService.getPacientes().subscribe((data: Paciente[]) => {
        this.pacientes = data;
      });
    } else {
      this.router.navigate(['/logout']);
    }
    this.isLoading = false;
  }

  onEdit(paciente: Paciente): void {
    // Lógica para editar el paciente
    console.log('Editar', paciente);
  }

  onDelete(paciente: Paciente): void {
    // Lógica para eliminar el paciente
    console.log('Eliminar', paciente);
  }
}
