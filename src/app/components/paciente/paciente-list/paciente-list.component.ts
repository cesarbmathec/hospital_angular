import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatCardHeader,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.scss',
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  dataSource: MatTableDataSource<Paciente> = new MatTableDataSource();
  isLoading: boolean = false;

  displayedColumns: string[] = ['id', 'nombre', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (this.authService.isAuthenticated()) {
      this.pacienteService
        .getPacientes()
        .pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
            this.isLoading = false;
            return throwError(() => new Error('Error fetching pacientes'));
          })
        )
        .subscribe((data: Paciente[]) => {
          this.pacientes = data;
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        });
    } else {
      this.router.navigate(['/logout']);
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onEdit(paciente: Paciente): void {
    // Lógica para editar el paciente
    console.log('Editar', paciente);
  }

  onDelete(paciente: Paciente): void {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar al paciente ${paciente.nombre} ${paciente.apellido}?`
    );

    if (confirmDelete) {
      this.isLoading = true;

      this.pacienteService.deletePaciente(paciente.id).subscribe({
        next: (success) => {
          if (success) {
            this.pacientes = this.pacientes.filter((p) => p.id !== paciente.id);
            this.dataSource.data = this.pacientes;
            alert(
              `Paciente ${paciente.nombre} ${paciente.apellido} eliminado exitosamente.`
            );
          } else {
            alert('Error al eliminar el paciente. Inténtalo de nuevo.');
          }
          this.isLoading = false;
        },
        error: (error) => {
          alert(
            'Ocurrió un error al eliminar el paciente. Inténtalo de nuevo.'
          );
          console.error('Error:', error);
          this.isLoading = false;
        },
      });
    }
  }

  onDetail(paciente: Paciente): void {
    // Lógica para eliminar el paciente
    console.log('Detail', paciente);
  }
}
