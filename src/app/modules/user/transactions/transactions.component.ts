import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface Transaction {
  id: number;
  txn_id: string;
  amount: number;
  type: string; // 'Credit' | 'Debit'
  status: string; // 'Pending' | 'Processed' | 'Completed' | 'Failed'
  reference: string;
  description: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  created_at: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  total = 0;
  page = 1;
  totalPages = 1;
  limit = 15;

  // Filters
  search = '';
  statusFilter = 'all';
  typeFilter = 'all';

  // Modals
  showFilterModal = false;
  showExportModal = false;
  selectedTransaction: Transaction | null = null;
  showReceiptModal = false;

  exportFormat = 'csv';
  exportSuccess = false;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    const params: any = {
      page: this.page,
      limit: this.limit
    };
    if (this.search) params.search = this.search;
    if (this.statusFilter !== 'all') params.status = this.statusFilter;
    if (this.typeFilter !== 'all') params.type = this.typeFilter;

    this.http.get<any>('https://backend-zpue.onrender.com/api/user/transactions', { params }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.transactions = res.data.transactions;
          this.total = res.data.total;
          this.totalPages = res.data.totalPages;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.showFilterModal = false;
    this.loadTransactions();
  }

  resetFilters(): void {
    this.search = '';
    this.statusFilter = 'all';
    this.typeFilter = 'all';
    this.page = 1;
    this.showFilterModal = false;
    this.loadTransactions();
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadTransactions();
    }
  }

  viewReceipt(t: Transaction): void {
    this.selectedTransaction = t;
    this.showReceiptModal = true;
  }

  closeReceiptModal(): void {
    this.showReceiptModal = false;
    this.selectedTransaction = null;
  }

  printReceipt(): void {
    window.print();
  }

  triggerExport(): void {
    this.exportSuccess = true;
    setTimeout(() => {
      this.exportSuccess = false;
      this.showExportModal = false;
    }, 2000);
  }
}
