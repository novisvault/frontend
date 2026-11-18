import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-transfers.component.html',
  styleUrls: ['./admin-transfers.component.scss']
})
export class AdminTransfersComponent implements OnInit {
  private http = inject(HttpClient);

  transfers: any[] = [];
  filterStatus = 'ALL';
  loading = true;
  message = '';

  ngOnInit(): void {
    this.fetchTransfers();
  }

  fetchTransfers(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/transfers').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.transfers = res.data;
      },
      error: () => this.loading = false
    });
  }

  filteredTransfers(): any[] {
    if (this.filterStatus === 'ALL') return this.transfers;
    return this.transfers.filter(t => t.status?.toLowerCase() === this.filterStatus.toLowerCase());
  }

  process(id: number, status: string): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/transfers/${id}/process`, { status }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.fetchTransfers();
        setTimeout(() => { this.message = ''; }, 4000);
      }
    });
  }
}
