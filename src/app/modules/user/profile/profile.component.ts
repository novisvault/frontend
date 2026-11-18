import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'password' | 'twofa' | 'pin' = 'info';

  user: any = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  // Profile Form
  name = '';
  phone = '';
  dob = '';
  address = '';
  country = 'United States';

  // Password Form
  current_password = '';
  new_password = '';
  confirm_password = '';

  // PIN Form
  current_pin = '';
  new_pin = '';
  confirm_pin = '';

  // 2FA
  twoFactorEnabled = false;

  // Photo modal
  showPhotoModal = false;

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/dashboard').subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.user) {
          this.user = res.data.user;
          this.name = this.user.name || '';
          this.phone = this.user.phone || '';
          this.dob = this.user.dob ? this.user.dob.split('T')[0] : '';
          this.address = this.user.address || '';
          this.country = this.user.country || 'United States';
          this.twoFactorEnabled = !!this.user.two_factor_secret;
        }
      }
    });
  }

  updateProfile(): void {
    this.clearMessages();
    this.loading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/profile', {
      name: this.name,
      phone: this.phone,
      dob: this.dob,
      address: this.address,
      country: this.country
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = 'Profile information updated successfully.';
          this.loadUserData();
        } else {
          this.errorMessage = res.message || 'Update failed.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Server error occurred.';
      }
    });
  }

  updatePassword(): void {
    this.clearMessages();
    if (!this.current_password || !this.new_password) {
      this.errorMessage = 'Please provide both current and new passwords.';
      return;
    }
    if (this.new_password !== this.confirm_password) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    this.loading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/change-password', {
      current_password: this.current_password,
      new_password: this.new_password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = 'Password updated successfully.';
          this.current_password = '';
          this.new_password = '';
          this.confirm_password = '';
        } else {
          this.errorMessage = res.message || 'Password update failed.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Current password is incorrect.';
      }
    });
  }

  updatePin(): void {
    this.clearMessages();
    if (!this.new_pin || this.new_pin.length !== 4) {
      this.errorMessage = 'New PIN must be exactly 4 digits.';
      return;
    }
    if (this.new_pin !== this.confirm_pin) {
      this.errorMessage = 'New PINs do not match.';
      return;
    }

    this.loading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/change-pin', {
      current_pin: this.current_pin,
      new_pin: this.new_pin
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = 'Transaction security PIN updated successfully.';
          this.current_pin = '';
          this.new_pin = '';
          this.confirm_pin = '';
        } else {
          this.errorMessage = res.message || 'PIN update failed.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Current PIN is incorrect.';
      }
    });
  }

  toggleTwoFactor(): void {
    this.clearMessages();
    this.loading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/toggle-2fa', {}).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.twoFactorEnabled = res.enabled;
          this.successMessage = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to update 2FA.';
      }
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getUserInitials(): string {
    const name = this.user?.name || 'Client';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
