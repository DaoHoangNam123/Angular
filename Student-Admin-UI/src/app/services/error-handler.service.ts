import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorInfo {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  details?: any;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private readonly errors$ = new BehaviorSubject<ErrorInfo[]>([]);
  private readonly maxErrors = 10; // Keep only last 10 errors

  getErrors(): Observable<ErrorInfo[]> {
    return this.errors$.asObservable();
  }

  getCurrentErrors(): ErrorInfo[] {
    return this.errors$.value;
  }

  handleError(error: any, context?: string): void {
    const errorInfo = this.createErrorInfo(error, context);
    this.addError(errorInfo);
    console.error(`Error in ${context || 'Unknown context'}:`, error);
  }

  handleHttpError(error: HttpErrorResponse, context?: string): void {
    const errorInfo = this.createHttpErrorInfo(error, context);
    this.addError(errorInfo);
    console.error(`HTTP Error in ${context || 'Unknown context'}:`, error);
  }

  clearErrors(): void {
    this.errors$.next([]);
  }

  removeError(index: number): void {
    const currentErrors = this.errors$.value;
    if (index >= 0 && index < currentErrors.length) {
      const newErrors = currentErrors.filter((_, i) => i !== index);
      this.errors$.next(newErrors);
    }
  }

  private createErrorInfo(error: any, context?: string): ErrorInfo {
    return {
      message: error?.message || 'An unknown error occurred',
      type: 'error',
      timestamp: new Date(),
      details: {
        context,
        error: error?.toString(),
        stack: error?.stack
      }
    };
  }

  private createHttpErrorInfo(error: HttpErrorResponse, context?: string): ErrorInfo {
    let message = 'An HTTP error occurred';
    let type: 'error' | 'warning' | 'info' = 'error';

    switch (error.status) {
      case 400:
        message = 'Bad Request: Invalid data provided';
        break;
      case 401:
        message = 'Unauthorized: Please log in again';
        type = 'warning';
        break;
      case 403:
        message = 'Forbidden: You do not have permission to perform this action';
        type = 'warning';
        break;
      case 404:
        message = 'Not Found: The requested resource was not found';
        type = 'info';
        break;
      case 409:
        message = 'Conflict: The resource already exists or is in use';
        break;
      case 422:
        message = 'Validation Error: Please check your input data';
        break;
      case 500:
        message = 'Internal Server Error: Please try again later';
        break;
      case 502:
        message = 'Bad Gateway: Server is temporarily unavailable';
        break;
      case 503:
        message = 'Service Unavailable: Please try again later';
        break;
      case 0:
        message = 'Network Error: Please check your connection';
        type = 'warning';
        break;
      default:
        message = `Server Error: ${error.status} - ${error.message}`;
    }

    return {
      message,
      type,
      timestamp: new Date(),
      details: {
        context,
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      }
    };
  }

  private addError(errorInfo: ErrorInfo): void {
    const currentErrors = this.errors$.value;
    const newErrors = [errorInfo, ...currentErrors].slice(0, this.maxErrors);
    this.errors$.next(newErrors);
  }
}
