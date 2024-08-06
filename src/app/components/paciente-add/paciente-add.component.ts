import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { noWhitespaceValidator } from '../validators/validators';
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
import { AlertComponent } from '../alert/alert.component';

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
    private _snackBar: MatSnackBar
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
          this._snackBar.openFromComponent(AlertComponent, {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 7 * 1000,
            data: {
              message: 'Paciente <strong>registrado</strong> correctamente!!',
              class: 'alert success',
            },
          });
          this.router.navigate(['/pacienteList']);
        },
        error: (err) => {
          this.isLoading = false;
          this._snackBar.openFromComponent(AlertComponent, {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 7 * 1000,
            data: {
              message: 'Error: <strong>No se registró</strong> el paciente!!',
              class: 'alert danger',
            },
          });
          console.error(err);
        },
      });
    }
  }
}
