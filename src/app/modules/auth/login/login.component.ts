import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  siteName = 'BankProX';
  login = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  twoFactorCode = '';
  requires2FA = false;
  twoFactorUserId: number | null = null;

  errorMessage = '';
  loading = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.login || !this.password) {
      this.errorMessage = 'Please enter your username/email and password.';
      return;
    }

    this.loading = true;
    this.auth.login({ login: this.login, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.twoFactorRequired) {
          this.requires2FA = true;
          this.twoFactorUserId = res.userId;
        } else if (res.success) {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials or account is suspended.';
      }
    });
  }

  submit2FA(): void {
    if (!this.twoFactorCode || !this.twoFactorUserId) return;
    this.loading = true;
    this.auth.verify2FA({ userId: this.twoFactorUserId, code: this.twoFactorCode }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid authentication code.';
      }
    });
  }
}
