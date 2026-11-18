import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  middlename?: string;
  lastname?: string;
  username: string;
  email: string;
  account_number: string;
  account_bal: number;
  roi?: number;
  bonus?: number;
  currency?: string;
  s_currency?: string;
  status?: string;
  account_verify?: string;
  limit?: number;
  grant_limit?: number;
  bank_name?: string;
  accounttype?: string;
}

export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://backend-zpue.onrender.com/api';

  currentUser = signal<User | null>(null);
  currentAdmin = signal<Admin | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const userStr = localStorage.getItem('bankprox_user');
    const adminStr = localStorage.getItem('bankprox_admin');
    if (userStr) {
      try { this.currentUser.set(JSON.parse(userStr)); } catch (e) {}
    }
    if (adminStr) {
      try { this.currentAdmin.set(JSON.parse(adminStr)); } catch (e) {}
    }
  }

  getToken(): string | null {
    return localStorage.getItem('bankprox_token');
  }

  getAdminToken(): string | null {
    return localStorage.getItem('bankprox_admin_token');
  }

  getAdminUser(): Admin | null {
    return this.currentAdmin();
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('bankprox_token', res.token);
          localStorage.setItem('bankprox_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }
      })
    );
  }

  login(credentials: { login: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('bankprox_token', res.token);
          localStorage.setItem('bankprox_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }
      })
    );
  }

  adminLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/admin/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('bankprox_admin_token', res.token);
          localStorage.setItem('bankprox_admin', JSON.stringify(res.admin));
          this.currentAdmin.set(res.admin);
        }
      })
    );
  }

  verify2FA(data: { userId: number; code: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/verify-2fa`, data).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('bankprox_token', res.token);
          localStorage.setItem('bankprox_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('bankprox_token');
    localStorage.removeItem('bankprox_user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  adminLogout(): void {
    localStorage.removeItem('bankprox_admin_token');
    localStorage.removeItem('bankprox_admin');
    this.currentAdmin.set(null);
    this.router.navigate(['/auth/admin/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdminLoggedIn(): boolean {
    return !!this.getAdminToken();
  }
}
