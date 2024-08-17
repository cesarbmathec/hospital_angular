import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    NgClass,
  ],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss',
})
export class PacienteComponent {
  isSidenavExpanded = true;

  constructor(private homeComponent: HomeComponent) {}

  ngOnInit() {
    this.homeComponent.sidenavState.subscribe((state: boolean) => {
      this.isSidenavExpanded = state;
    });
  }
}
