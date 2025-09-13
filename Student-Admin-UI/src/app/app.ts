import { Component } from '@angular/core';
import { Student } from './pages/student/student';
@Component({
  selector: 'app-root',
  imports: [Student],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {}
