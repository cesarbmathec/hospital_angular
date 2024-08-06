import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authenticated: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.authenticated = isAuthenticated;
    });
    if (this.authenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
