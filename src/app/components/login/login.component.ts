import { Component } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatFormField } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInput,
    MatButton,
    MatCard,
    MatIcon,
    MatProgressBar,
    MatFormField,
    MatLabel,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      // Autenticación
      this.pacienteService.authenticate(username, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/pacienteList']);
        },
        error: (err: any) => {
          this.isLoading = false;
          alert('Error en el inicio de sesión');
          console.error(err);
        },
      });
    }
  }
}
