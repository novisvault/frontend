import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);

  dashboardData: any = null;
  loading = true;
  balanceVisible = true;
  greeting = 'Good Day';
  currentDate = '';
  showBankDetailsModal = false;
  copySuccess = false;

  beneficiaries = [
    { id: 1, name: 'Alice Smith', initials: 'AS', color: 'bg-emerald-500', is_favorite: true },
    { id: 2, name: 'Robert Chen', initials: 'RC', color: 'bg-blue-500', is_favorite: false },
    { id: 3, name: 'Emma Watson', initials: 'EW', color: 'bg-indigo-500', is_favorite: true },
    { id: 4, name: 'Michael Brown', initials: 'MB', color: 'bg-purple-500', is_favorite: false },
    { id: 5, name: 'Sophia Taylor', initials: 'ST', color: 'bg-pink-500', is_favorite: false }
  ];

  ngOnInit(): void {
    this.updateGreeting();
    this.fetchDashboard();
  }

  updateGreeting(): void {
    const now = new Date();
    const hr = now.getHours();
    if (hr < 12) this.greeting = 'Good Morning';
    else if (hr < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    this.currentDate = now.toLocaleDateString(undefined, options);
  }

  fetchDashboard(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/dashboard').subscribe({
      next: (res) => {
        if (res.success) {
          this.dashboardData = res.data;
          if (res.data.user) {
            this.auth.currentUser.set(res.data.user);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }

  toggleBalance(): void {
    this.balanceVisible = !this.balanceVisible;
  }

  openBankDetails(): void {
    this.showBankDetailsModal = true;
  }

  closeBankDetails(): void {
    this.showBankDetailsModal = false;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copySuccess = true;
      setTimeout(() => this.copySuccess = false, 2000);
    });
  }

  getUserInitials(): string {
    const u = this.dashboardData?.user || this.auth.currentUser();
    if (!u) return 'BX';
    const first = u.name ? u.name.charAt(0) : 'B';
    const last = u.lastname ? u.lastname.charAt(0) : 'X';
    return (first + last).toUpperCase();
  }

  getMaskedAccountNumber(): string {
    const num = this.dashboardData?.user?.account_number || this.auth.currentUser()?.account_number;
    if (!num) return '1019';
    const str = String(num);
    return str.length > 4 ? str.slice(-4) : str;
  }
}
