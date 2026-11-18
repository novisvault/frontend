import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-create-user.component.html',
  styleUrls: ['./admin-create-user.component.scss']
})
export class AdminCreateUserComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Form Fields Matching createnewuser.blade.php
  name = '';
  middlename = '';
  lastname = '';
  username = '';
  email = '';
  phone = '';
  dob = '1990-01-01';
  address = '';
  country = 'United States';
  accounttype = 'Checking Account';
  usernumber = '';
  balance: number = 0;
  code1 = '';
  code2 = '';
  code3 = '';
  code4 = '';
  code5 = '';
  pin = '';
  password = '';
  password_confirmation = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Switzerland', 'Singapore', 'Japan', 'United Arab Emirates', 'South Africa',
    'Nigeria', 'Brazil', 'China', 'India', 'Spain', 'Italy', 'Netherlands'
  ];

  accountTypes = [
    'Checking Account',
    'Savings Account',
    'Fixed Deposit Account',
    'Current Account',
    'Crypto Currency Account',
    'Business Account',
    'Non Resident Account',
    'Corporate Business Account',
    'Investment Account'
  ];

  ngOnInit(): void {
    // Generate random 10-digit account number and random codes
    this.usernumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    this.code1 = Math.floor(1000 + Math.random() * 9000).toString();
    this.code2 = Math.floor(1000 + Math.random() * 9000).toString();
    this.code3 = Math.floor(1000 + Math.random() * 9000).toString();
    this.code4 = Math.floor(1000 + Math.random() * 9000).toString();
    this.code5 = Math.floor(1000 + Math.random() * 9000).toString();
    this.pin = Math.floor(1000 + Math.random() * 9000).toString();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please provide client name, email, and password.';
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.errorMessage = 'Password confirmation does not match.';
      return;
    }

    this.loading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/admin/users', {
      name: this.name,
      middlename: this.middlename,
      lastname: this.lastname,
      username: this.username || this.email.split('@')[0],
      email: this.email,
      phone: this.phone,
      dob: this.dob,
      address: this.address,
      country: this.country,
      accounttype: this.accounttype,
      usernumber: this.usernumber,
      balance: this.balance,
      code1: this.code1,
      code2: this.code2,
      code3: this.code3,
      code4: this.code4,
      code5: this.code5,
      pin: this.pin,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = res.message;
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 1500);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to create user.';
      }
    });
  }
}
