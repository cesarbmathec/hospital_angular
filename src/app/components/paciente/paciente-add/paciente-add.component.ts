import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PacienteService } from '../../../services/paciente.service';
import { noWhitespaceValidator } from '../../validators/validators';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import {
  AlertDialogComponent,
  DialogData,
} from '../../alert-dialog/alert-dialog.component';
import { Paciente } from '../../../interfaces/Paciente';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-paciente-add',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    NgIf,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDialogContent,
    MatCardActions,
    MatDatepickerModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './paciente-add.component.html',
  styleUrl: './paciente-add.component.scss',
})
export class PacienteAddComponent implements OnInit {
  pacienteId!: number;
  isEditMode: boolean = false;
  paciente!: Paciente;

  pacienteForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dialogRef?: MatDialogRef<PacienteAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: number // Inyecta el ID del paciente
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, noWhitespaceValidator]],
      apellido: ['', [Validators.required, noWhitespaceValidator]],
      fecha_nacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      direccion: [''],
      telefono: [''],
      correo_electronico: ['', [Validators.email]],
      cedula_identidad: ['', [Validators.required, noWhitespaceValidator]],
    });

    // Si data tiene un ID, se establece el modo de edición
    if (this.data) {
      this.pacienteId = this.data;
      this.isEditMode = true;
      this.loadPacienteData(this.pacienteId); // Cargar datos del paciente
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      if (this.isEditMode) {
        this.paciente = { id: this.pacienteId, ...this.pacienteForm.value };
        this.pacienteService.updatePaciente(this.paciente).subscribe({
          next: () => {
            this.showDialog(
              'Editado Correctamente',
              `El paciente ${this.pacienteForm.value.nombre}, ${this.pacienteForm.value.apellido} ha sido editado correctamente.`,
              'success'
            );
            this.closeDialog();
            // this.router.navigate(['/paciente/pacienteList']);
          },
          error: (error) => {
            this.showDialog('Error', 'Error al editar los datos.', 'danger');
            //this.router.navigate(['/paciente/pacienteList']);
          },
        });
      } else {
        // Agregar paciente
        this.isLoading = true;
        this.pacienteForm.value.fecha_nacimiento = this.formatDate(
          this.pacienteForm.value.fecha_nacimiento
        );
        const paciente = this.pacienteForm.value;
        this.pacienteService.addPaciente(paciente).subscribe({
          next: () => {
            this.isLoading = false;
            // Mensaje
            this.showDialog(
              'Paciente agregado',
              'El paciente se ha agregado correctamente.',
              'success'
            );
            this.closeDialog();
            //this.router.navigate(['/paciente/pacienteList']);
          },
          error: (err) => {
            this.isLoading = false;
            // Mensaje
            this.showDialog(
              'Error',
              'No se pudo agregar el paciente.',
              'danger'
            );
            console.error(err);
          },
        });
      }
    }
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

  loadPacienteData(id: number): void {
    this.pacienteService.getPacienteById(id).subscribe({
      next: (paciente: Paciente) => {
        this.pacienteForm.patchValue(paciente);
        this.paciente = paciente; // Guarda el paciente cargado
      },
      error: (error) => {
        console.error('Error loading paciente:', error);
      },
    });
  }

  // Método para cerrar el diálogo
  closeDialog(): void {
    this.dialogRef?.close();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
