import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../api/login.api';
import { AuthService } from '../../services/auth.service';
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
    private readonly api: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  /* Submit login form */
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
            this.auth.login(res.jwtToken);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = 'Login failed. Please try again.';
          },
        });
    } catch (error) {
      this.loading = false;
    }
  }
}
