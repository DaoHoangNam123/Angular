import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = localStorage.getItem('access_token');
    this.loggedIn$.next(!!token);
  }
  public isLoggedIn() {
    return this.loggedIn$.asObservable();
  }
  public login(token: string) {
    localStorage.setItem('access_token', token);
    this.loggedIn$.next(true);
  }

  public logout() {
    localStorage.removeItem('access_token');
    this.loggedIn$.next(false);
  }

  public hasToken(): boolean {
    console.log('>>>>>>>hasToken', localStorage.getItem('access_token'));
    return !!localStorage.getItem('access_token');
  }
}
