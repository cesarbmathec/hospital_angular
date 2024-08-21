import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { Paciente } from '../../../interfaces/paciente';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-paciente-detail',
  standalone: true,
  imports: [MatCardModule, MatDialogModule, MatButtonModule, MatDividerModule],
  templateUrl: './paciente-detail.component.html',
  styleUrl: './paciente-detail.component.scss',
})
export class PacienteDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Paciente) {}
}
