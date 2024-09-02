import { Component, OnInit } from '@angular/core';
import {
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConsultaService } from '../../../services/consulta.service';
import { MatInputModule } from '@angular/material/input';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-consulta-add',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    NgFor,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatLabel,
    MatOption,
    MatButtonModule,
    MatCardActions,
  ],
  templateUrl: './consulta-add.component.html',
  styleUrl: './consulta-add.component.scss',
})
export class ConsultaAddComponent {
  consultaForm: FormGroup;
  medicos: any[] = [];
  pacientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private consultaService: ConsultaService
  ) {
    this.consultaForm = this.fb.group({
      paciente: ['', Validators.required],
      medico: ['', Validators.required],
      fecha_consulta: ['', Validators.required],
      diagnostico: [''],
      tratamiento: [''],
      notas: [''],
    });
  }

  ngOnInit(): void {}

  loadMedicos() {}

  loadHistoriasClinicas() {}

  onSubmit() {}
}
