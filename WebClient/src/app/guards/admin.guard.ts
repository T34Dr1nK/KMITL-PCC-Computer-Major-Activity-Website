// Create AdminGuard for pages restricted to Admin only
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  // constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getUserRole() === 'admin') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}