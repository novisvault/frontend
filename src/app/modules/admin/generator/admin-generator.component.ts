import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-generator.component.html',
  styleUrls: ['./admin-generator.component.scss']
})
export class AdminGeneratorComponent implements OnInit {
  private http = inject(HttpClient);

  users: any[] = [];
  selectedUserId: number | null = null;
  numTransactions = 10;
  minAmount = 250;
  maxAmount = 3500;
  transactionType = 'Credit';
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];

  loading = false;
  message = '';
  isSuccess = false;

  ngOnInit(): void {
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/users').subscribe({
      next: (res) => {
        if (res.success) {
          this.users = res.data;
          if (this.users.length > 0) this.selectedUserId = this.users[0].id;
        }
      }
    });
  }

  generate(): void {
    this.message = '';
    if (!this.selectedUserId) {
      this.message = 'Please select a client account.';
      this.isSuccess = false;
      return;
    }

    this.loading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/admin/transactions/generate', {
      user_id: this.selectedUserId,
      num_transactions: this.numTransactions,
      min_amount: this.minAmount,
      max_amount: this.maxAmount,
      transaction_type: this.transactionType,
      start_date: this.startDate,
      end_date: this.endDate
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.isSuccess = true;
        this.message = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to generate transactions.';
      }
    });
  }
}
