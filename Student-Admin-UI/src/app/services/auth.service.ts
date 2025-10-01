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

  public login(token: string, user: any) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('userName', user.userName);
    this.loggedIn$.next(true);
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userName');
    this.loggedIn$.next(false);
  }

  public hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  public getUser(): string {
    return localStorage.getItem('userName') || '';
  }
}
