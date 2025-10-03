import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<{ jwtToken: string; user: any }> {
    return this.http.post<{ jwtToken: string; user: any }>(`${this.baseUrl}/auth/login`, {
      username,
      password,
    });
  }
}
