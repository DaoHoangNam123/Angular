import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  userName: string;
  id?: string;
  email?: string;
  roles?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly currentUser$ = new BehaviorSubject<User | null>(null);
  
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'userName';
  private readonly USER_DATA_KEY = 'userData';

  constructor() {
    this.initializeAuthState();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  public getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  public login(token: string, user: User): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, user.userName);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      
      this.currentUser$.next(user);
      this.loggedIn$.next(true);
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  public logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
      
      this.currentUser$.next(null);
      this.loggedIn$.next(false);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  public hasToken(): boolean {
    try {
      return !!localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  }

  public getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  }

  public getUser(): string {
    try {
      return localStorage.getItem(this.USER_KEY) || '';
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return '';
    }
  }

  public getUserData(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  private initializeAuthState(): void {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userData = this.getUserData();
      
      if (token && userData) {
        this.currentUser$.next(userData);
        this.loggedIn$.next(true);
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.logout();
    }
  }
}
