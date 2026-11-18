import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface Loan {
  id: number;
  amount: number;
  income: number;
  purpose: string;
  duration: number;
  facility: string;
  status: string; // 'Pending' | 'Active' | 'Processed' | 'Declined'
  created_at: string;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];
  hasActiveLoan = false;
  loading = false;
  showApplicationForm = false;

  // Loan Form Fields
  amount: number | null = null;
  facility = 'Personal Liquidity Facility';
  duration = 12; // months
  purpose = 'Business Expansion';
  income: number | null = null;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  facilityOptions = [
    { name: 'Personal Liquidity Facility', rate: '4.5%', max: 50000 },
    { name: 'Commercial & Business Capital', rate: '5.2%', max: 250000 },
    { name: 'Real Estate & Mortgage Reserve', rate: '3.8%', max: 1000000 },
    { name: 'Equipment & Fleet Financing', rate: '4.9%', max: 150000 }
  ];

  durationOptions = [6, 12, 24, 36, 48, 60];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/loans').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.loans = res.data.loans;
          this.hasActiveLoan = res.data.hasActiveLoan;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getEstimatedMonthlyPayment(): number {
    if (!this.amount || this.amount <= 0 || !this.duration) return 0;
    const rate = 0.045 / 12;
    const n = this.duration;
    const monthly = (this.amount * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return isNaN(monthly) ? 0 : monthly;
  }

  getTotalRepayment(): number {
    return this.getEstimatedMonthlyPayment() * (this.duration || 12);
  }

  submitApplication(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.amount || this.amount < 1000) {
      this.errorMessage = 'Minimum loan application amount is $1,000.00.';
      return;
    }
    if (!this.income || this.income <= 0) {
      this.errorMessage = 'Please provide your verified monthly income.';
      return;
    }

    this.isSubmitting = true;
    const payload = {
      amount: this.amount,
      facility: this.facility,
      duration: this.duration,
      purpose: this.purpose,
      income: this.income
    };

    this.http.post<any>('https://backend-zpue.onrender.com/api/user/loans', payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.successMessage = res.message || 'Loan application submitted successfully!';
          this.showApplicationForm = false;
          this.loadLoans();
        } else {
          this.errorMessage = res.message || 'Application failed.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Server error while submitting loan application.';
      }
    });
  }
}
