import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout(): void {
    this.pacienteService.logout();
    this.router.navigate(['/login']);
  }
}
