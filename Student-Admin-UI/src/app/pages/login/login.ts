import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  public email = '';
  public password = '';
  public errorMessage = '';
  public loading = false;

  constructor(
    private readonly api: AuthService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}
  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      this.api
        .login(this.email, this.password)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (res) => {
            localStorage.setItem('access_token', res.jwtToken);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = 'Login failed. Please try again.';
          },
        });
    } catch (error) {
      this.loading = false;
      console.log('>>>>>>>Error', error);
    }
  }
}
