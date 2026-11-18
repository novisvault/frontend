import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Please provide admin email and master password.';
      return;
    }

    this.loading = true;
    this.auth.adminLogin({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Access Denied: Invalid administrative credentials.';
      }
    });
  }
}
