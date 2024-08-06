import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeoutId: any;
  private readonly timeoutDuration = 1000 * 60 * 3; // 1 minutos en milisegundos

  constructor(
    private router: Router,
    private autheService: AuthService,
    private ngZone: NgZone
  ) {
    this.startWatching();
  }

  startWatching(): void {
    this.resetTimer();

    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach((event) =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  stopWatching(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private resetTimer(): void {
    this.stopWatching();

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => this.logout(), this.timeoutDuration);
    });
  }

  private logout(): void {
    this.autheService.logout();
    this.router.navigate(['/login']);
  }
}
