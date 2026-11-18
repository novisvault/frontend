import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  siteName = 'BankProX';
  name = '';
  username = '';
  email = '';
  password = '';
  phone = '';
  country = 'United States';
  termsAccepted = true;

  errorMessage = '';
  loading = false;

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.name || !this.username || !this.email || !this.password) {
      this.errorMessage = 'Please complete all required registration fields.';
      return;
    }
    if (!this.termsAccepted) {
      this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy.';
      return;
    }

    this.loading = true;
    this.auth.register({
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      phone: this.phone,
      country: this.country
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      }
    });
  }
}
