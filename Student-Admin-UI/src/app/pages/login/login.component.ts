import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { finalize, takeUntil, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../api/login.api';
import { AuthService, User } from '../../services/auth.service';
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  jwtToken: string;
  user: User;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnDestroy {
  public email = '';
  public password = '';
  public errorMessage = '';
  public loading = false;
  public formData: LoginFormData = { email: '', password: '' };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly api: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  /* Submit login form */
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.formData = { email: this.email, password: this.password };

    this.api
      .login(this.email, this.password)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: LoginResponse) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
        },
      });
  }

  private validateForm(): boolean {
    if (!this.email?.trim()) {
      this.errorMessage = 'Please enter your email address';
      return false;
    }

    if (!this.password?.trim()) {
      this.errorMessage = 'Please enter your password';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleLoginSuccess(response: LoginResponse): void {
    try {
      this.auth.login(response.jwtToken, response.user);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error during login process:', error);
      this.errorMessage = 'Login successful but failed to save session. Please try again.';
    }
  }

  private handleLoginError(error: any): void {
    console.error('Login error:', error);

    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password. Please check your credentials.';
    } else if (error.status === 0) {
      this.errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.status >= 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  public clearError(): void {
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
