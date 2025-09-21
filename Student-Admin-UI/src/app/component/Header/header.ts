import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
