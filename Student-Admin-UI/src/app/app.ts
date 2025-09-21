import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(private readonly auth: AuthService) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
}
