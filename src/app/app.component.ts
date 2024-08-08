import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InactivityService } from './services/inactivity.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authenticated = false;

  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    this.inactivityService.startWatching();
  }
}
