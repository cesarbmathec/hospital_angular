import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PacienteComponent } from './paciente/paciente.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PacienteComponent, MatButtonModule, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'hospital_angular';
}
