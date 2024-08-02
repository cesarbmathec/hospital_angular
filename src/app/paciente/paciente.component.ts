import { Component, OnInit } from '@angular/core';
import { Paciente } from '../interfaces/paciente';
import { CommonModule, NgFor } from '@angular/common';
import { PacienteService } from '../services/paciente.service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [NgFor, CommonModule, MatProgressBar],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss',
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading: boolean = false;

  username = 'edixoncesar';
  password = '8622Coquito*%';

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.pacienteService.authenticate(this.username, this.password).subscribe({
      next: () => {
        this.pacienteService.getPacientes().subscribe((data: Paciente[]) => {
          this.pacientes = data;
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Error al autenticar:', err);
        this.isLoading = false;
      },
    });
  }
}
