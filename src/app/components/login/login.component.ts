import { Component, signal } from '@angular/core';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { noWhitespaceValidator } from '../validators/validators';
import { AuthService } from '../../services/auth.service';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';

import { CaptchaComponent } from '../captcha/captcha.component';
import {
  AlertDialogComponent,
  DialogData,
} from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatLabel,
    MatError,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    NgIf,
    MatGridListModule,
    MatGridTile,
    CaptchaComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    /*
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, noWhitespaceValidator]],
      password: ['', [Validators.required, noWhitespaceValidator]],
      recaptchaReactive: ['', Validators.required],
    });
    */
    this.loginForm = new FormGroup({
      recaptchaReactive: new FormControl(null, Validators.required),
      username: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
      password: new FormControl(null, [
        Validators.required,
        noWhitespaceValidator,
      ]),
    });
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      // Autenticación
      this.authService.authenticate(username, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (_err: any) => {
          this.isLoading = false;
          this.showDialog(
            'Datos Incorrectos',
            'Usuario o Password incorrecto!!',
            'danger'
          );
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
