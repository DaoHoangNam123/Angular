import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  canActivate(): boolean {
    console.log('>>>>>>>canActivate', this.auth.hasToken());
    if (!this.auth.hasToken()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
