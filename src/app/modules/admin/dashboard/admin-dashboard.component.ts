import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  adminUser: any = null;
  stats: any = null;
  loading = true;

  ngOnInit(): void {
    this.adminUser = this.authService.getAdminUser();
    this.fetchStats();
  }

  fetchStats(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/dashboard').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.stats = res.data;
      },
      error: () => this.loading = false
    });
  }

  processTransfer(id: number, status: string): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/transfers/${id}/process`, { status }).subscribe({
      next: () => this.fetchStats()
    });
  }

  processDeposit(id: number, action: string): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/deposits/${id}/process`, { action }).subscribe({
      next: () => this.fetchStats()
    });
  }
}
