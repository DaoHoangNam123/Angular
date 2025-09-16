import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private readonly router: Router) {}
  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
