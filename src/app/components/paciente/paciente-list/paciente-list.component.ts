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
import { Paciente } from '../../../interfaces/Paciente';
import { AuthService } from '../../../services/auth.service';
import { PacienteService } from '../../../services/paciente.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertDialogComponent,
  DialogData,
} from '../../alert-dialog/alert-dialog.component';
import { PacienteDetailComponent } from '../paciente-detail/paciente-detail.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PacienteAddComponent } from '../paciente-add/paciente-add.component';

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
    MatTooltipModule,
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
    private pacienteService: PacienteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (this.authService.isAuthenticated()) {
      this.pacienteService.pacientes$.subscribe((data: Paciente[]) => {
        this.pacientes = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });

      // Cargar pacientes inicialmente
      this.pacienteService.getPacientes().subscribe();
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
    this.dialog.open(PacienteAddComponent, {
      maxHeight: '90vh',
      data: paciente.id,
    });
  }

  onDelete(paciente: Paciente): void {
    const dialogData: DialogData = {
      title: 'Eliminar Paciente',
      message: `¿Estás seguro de que deseas eliminar al paciente ${paciente.nombre} ${paciente.apellido}?`,
      type: 'danger',
      typeButton: 'danger',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    };

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;

        this.pacienteService.deletePaciente(paciente.id).subscribe({
          next: (success) => {
            if (success) {
              this.pacientes = this.pacientes.filter(
                (p) => p.id !== paciente.id
              );
              this.dataSource.data = this.pacientes;
              this.showDialog(
                'Paciente eliminado',
                `El paciente ${paciente.nombre} ${paciente.apellido} ha sido eliminado exitosamente.`,
                'success'
              );
            } else {
              this.showDialog(
                'Error',
                'Error al eliminar el paciente. Inténtalo de nuevo.',
                'danger'
              );
            }
            this.isLoading = false;
          },
          error: (error) => {
            this.showDialog(
              'Error',
              'Ocurrió un error al eliminar el paciente. Inténtalo de nuevo.',
              'danger'
            );
            console.error('Error:', error);
            this.isLoading = false;
          },
        });
      }
    });
  }

  onDetail(paciente: Paciente): void {
    this.dialog.open(PacienteDetailComponent, {
      data: paciente, // Pasa los datos del paciente al componente de detalle
    });
  }

  showDialog(
    title: string,
    message: string,
    type: 'success' | 'danger' | 'warning'
  ) {
    const dialogData: DialogData = {
      title,
      message,
      type,
      confirmButtonText: 'Ok',
    };

    this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: dialogData,
    });
  }
}
