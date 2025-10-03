import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login endpoint
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    const token = this.auth.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleHttpError(error, req, next);
      })
    );
  }

  private handleHttpError(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const errorContext = `HTTP ${req.method} ${req.url}`;

    switch (error.status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 404:
        this.errorHandler.handleHttpError(error, errorContext);
        break;
      case 500:
      case 502:
      case 503:
        this.errorHandler.handleHttpError(error, errorContext);
        break;
      case 0:
        this.handleNetworkError(error);
        break;
      default:
        this.errorHandler.handleHttpError(error, errorContext);
    }

    return throwError(() => error);
  }

  private handleUnauthorized(): void {
    this.auth.logout();
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private handleForbidden(): void {
    this.auth.logout();
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private handleNetworkError(error: HttpErrorResponse): void {
    console.error('Network Error:', error);
    this.errorHandler.handleError(
      new Error(APP_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR),
      'Network Connection'
    );
  }
}
