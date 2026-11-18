import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-deposits.component.html',
  styleUrls: ['./admin-deposits.component.scss']
})
export class AdminDepositsComponent implements OnInit {
  private http = inject(HttpClient);

  deposits: any[] = [];
  loading = true;
  message = '';
  selectedProof: string | null = null;

  ngOnInit(): void {
    this.fetchDeposits();
  }

  fetchDeposits(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/deposits').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.deposits = res.data;
      },
      error: () => this.loading = false
    });
  }

  process(id: number, action: string): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/deposits/${id}/process`, { action }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.fetchDeposits();
        setTimeout(() => { this.message = ''; }, 4000);
      }
    });
  }

  viewProof(proof: string): void {
    this.selectedProof = proof;
  }

  closeProof(): void {
    this.selectedProof = null;
  }
}
