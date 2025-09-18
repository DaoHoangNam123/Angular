import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:5083/api';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<{ jwtToken: string }> {
    return this.http.post<{ jwtToken: string }>(`${this.baseUrl}/auth/login`, {
      username,
      password,
    });
  }
}
