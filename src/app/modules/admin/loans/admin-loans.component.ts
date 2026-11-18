import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-loans.component.html',
  styleUrls: ['./admin-loans.component.scss']
})
export class AdminLoansComponent implements OnInit {
  private http = inject(HttpClient);

  loans: any[] = [];
  loading = true;
  message = '';

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/loans').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.loans = res.data;
      },
      error: () => this.loading = false
    });
  }

  process(id: number, action: string): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/loans/${id}/process`, { action }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.fetchLoans();
        setTimeout(() => { this.message = ''; }, 4000);
      }
    });
  }
}
