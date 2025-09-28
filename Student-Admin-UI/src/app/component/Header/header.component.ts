import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false,
})
export class HeaderComponent {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
