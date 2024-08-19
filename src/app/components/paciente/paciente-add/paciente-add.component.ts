import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
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
import { MatDialog } from '@angular/material/dialog';
import {
  AlertDialogComponent,
  DialogData,
} from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-paciente-add',
  standalone: true,
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
  ],
  templateUrl: './paciente-add.component.html',
  styleUrl: './paciente-add.component.scss',
})
export class PacienteAddComponent {
  pacienteForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router,
    private dialog: MatDialog
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
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      this.isLoading = true;
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
          this.router.navigate(['/paciente/pacienteList']);
        },
        error: (err) => {
          this.isLoading = false;
          // Mensaje
          this.showDialog('Error', 'No se pudo agregar el paciente.', 'danger');
          console.error(err);
        },
      });
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
}
