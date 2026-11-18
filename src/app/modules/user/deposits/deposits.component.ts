import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss']
})
export class DepositsComponent implements OnInit {
  private http = inject(HttpClient);

  methods: any[] = [];
  deposits: any[] = [];
  selectedMethod: any = null;
  loading = true;

  amount: number | null = null;
  proofFile: File | null = null;

  message = '';
  isSuccess = false;
  submitting = false;
  copied = false;

  ngOnInit(): void {
    this.fetchMethods();
    this.fetchHistory();
  }

  fetchMethods(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/deposits/methods').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.methods = res.data;
          if (this.methods.length > 0) this.selectedMethod = this.methods[0];
        }
      },
      error: () => this.loading = false
    });
  }

  fetchHistory(): void {
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/deposits/history').subscribe({
      next: (res) => {
        if (res.success) this.deposits = res.data;
      }
    });
  }

  selectMethod(method: any): void {
    this.selectedMethod = method;
    this.copied = false;
    this.message = '';
  }

  copyAddress(text: string): void {
    navigator.clipboard.writeText(text);
    this.copied = true;
    setTimeout(() => this.copied = false, 2500);
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.proofFile = event.target.files[0];
    }
  }

  submitDeposit(): void {
    this.message = '';
    if (!this.amount || this.amount <= 0) {
      this.message = 'Please specify a valid deposit amount.';
      this.isSuccess = false;
      return;
    }

    const formData = new FormData();
    formData.append('amount', this.amount.toString());
    formData.append('payment_mode', this.selectedMethod?.name || 'Crypto');
    if (this.proofFile) {
      formData.append('proof', this.proofFile);
    }

    this.submitting = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/deposits', formData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.isSuccess = true;
        this.message = res.message;
        this.amount = null;
        this.proofFile = null;
        this.fetchHistory();
      },
      error: (err) => {
        this.submitting = false;
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to submit deposit.';
      }
    });
  }
}
