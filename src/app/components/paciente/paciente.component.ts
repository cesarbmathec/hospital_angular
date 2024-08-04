import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../interfaces/paciente';

import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, MatProgressBar, MatTableModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss',
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading: boolean = false;

  displayedColumns: string[] = ['id', 'nombre', 'cedula_identidad'];

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log(this.pacienteService.isAuthenticated());
    if (this.pacienteService.isAuthenticated()) {
      this.pacienteService.getPacientes().subscribe((data: Paciente[]) => {
        this.pacientes = data;
      });
    } else {
      this.pacienteService.logout();
      this.router.navigate(['/logout']);
    }
    this.isLoading = false;
  }
}
