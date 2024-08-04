import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PacienteComponent } from './components/paciente/paciente.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { InactivityService } from './services/inactivity.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PacienteComponent,
    MatButtonModule,
    MatToolbar,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    this.inactivityService.startWatching();
  }
}
