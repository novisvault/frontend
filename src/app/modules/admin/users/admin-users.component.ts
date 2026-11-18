import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  users: any[] = [];
  search = '';
  loading = true;

  // Selected User for Management Drawer / Modals
  selectedUser: any = null;
  isManageDrawerOpen = false;
  isCreditModalOpen = false;
  isDebitModalOpen = false;
  isBalanceModalOpen = false;
  isLimitsModalOpen = false;
  isCodesModalOpen = false;
  isPasswordModalOpen = false;

  // Credit Form
  creditAmount: number = 0;
  creditMemo: string = '';
  creditChannel: string = 'Bank Wire Settlement';
  creditDate: string = '';

  // Debit Form
  debitAmount: number = 0;
  debitMemo: string = '';
  debitChannel: string = 'Institutional Wire Outflow';
  debitDate: string = '';

  // Balance Form
  editBalance: number = 0;
  editBtcBalance: number = 0;
  editBonus: number = 0;
  editRoi: number = 0;

  // Limits Form
  editLimit: number = 50000;
  editGrantLimit: number = 50000;

  // Codes Form
  code1 = '';
  code2 = '';
  code3 = '';
  code4 = '';
  code5 = '';
  pin = '';

  // Password Form
  newPassword = '';

  alertMessage = '';
  alertType = 'success';

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.http.get<any>(`https://backend-zpue.onrender.com/api/admin/users?search=${encodeURIComponent(this.search)}`).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.users = res.data;
      },
      error: () => this.loading = false
    });
  }

  getInitials(name: string, lastname?: string): string {
    const first = (name || '').trim().charAt(0);
    const last = (lastname || '').trim().charAt(0);
    return (first + (last || name?.charAt(1) || '')).toUpperCase();
  }

  openManageDrawer(user: any): void {
    this.selectedUser = user;
    this.isManageDrawerOpen = true;
    // Fetch full user details
    this.http.get<any>(`https://backend-zpue.onrender.com/api/admin/users/${user.id}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedUser = res.data.user;
          this.selectedUser.transactions = res.data.transactions || [];
          this.selectedUser.cards = res.data.cards || [];
          this.selectedUser.loans = res.data.loans || [];
          this.selectedUser.grants = res.data.grants || [];
        }
      }
    });
  }

  closeManageDrawer(): void {
    this.isManageDrawerOpen = false;
  }

  // Credit Account
  openCreditModal(): void {
    this.creditAmount = 0;
    this.creditMemo = 'Institutional Direct Credit';
    this.creditChannel = 'Direct Wire Transfer';
    this.creditDate = new Date().toISOString().slice(0, 10);
    this.isCreditModalOpen = true;
  }

  submitCredit(): void {
    if (!this.creditAmount || this.creditAmount <= 0) return;
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/credit`, {
      amount: this.creditAmount,
      description: this.creditMemo,
      payment_mode: this.creditChannel,
      date: this.creditDate
    }).subscribe({
      next: (res) => {
        this.isCreditModalOpen = false;
        this.showAlert(res.message, 'success');
        this.openManageDrawer(this.selectedUser);
        this.fetchUsers();
      },
      error: (err) => this.showAlert(err.error?.message || 'Credit failed', 'danger')
    });
  }

  // Debit Account
  openDebitModal(): void {
    this.debitAmount = 0;
    this.debitMemo = 'Institutional Wire Debit';
    this.debitChannel = 'Wire Outflow';
    this.debitDate = new Date().toISOString().slice(0, 10);
    this.isDebitModalOpen = true;
  }

  submitDebit(): void {
    if (!this.debitAmount || this.debitAmount <= 0) return;
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/debit`, {
      amount: this.debitAmount,
      description: this.debitMemo,
      payment_mode: this.debitChannel,
      date: this.debitDate
    }).subscribe({
      next: (res) => {
        this.isDebitModalOpen = false;
        this.showAlert(res.message, 'success');
        this.openManageDrawer(this.selectedUser);
        this.fetchUsers();
      },
      error: (err) => this.showAlert(err.error?.message || 'Debit failed', 'danger')
    });
  }

  // Edit Balance
  openBalanceModal(): void {
    this.editBalance = this.selectedUser.account_bal || 0;
    this.editBtcBalance = this.selectedUser.btc_balance || 0;
    this.editBonus = this.selectedUser.bonus || 0;
    this.editRoi = this.selectedUser.roi || 0;
    this.isBalanceModalOpen = true;
  }

  submitBalance(): void {
    this.http.put<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/balance`, {
      account_bal: this.editBalance,
      btc_balance: this.editBtcBalance,
      bonus: this.editBonus,
      roi: this.editRoi
    }).subscribe({
      next: (res) => {
        this.isBalanceModalOpen = false;
        this.showAlert(res.message, 'success');
        this.openManageDrawer(this.selectedUser);
        this.fetchUsers();
      }
    });
  }

  // Edit Limits
  openLimitsModal(): void {
    this.editLimit = this.selectedUser.limit || 50000;
    this.editGrantLimit = this.selectedUser.grant_limit || 50000;
    this.isLimitsModalOpen = true;
  }

  submitLimits(): void {
    this.http.put<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/limits`, {
      limit: this.editLimit,
      grant_limit: this.editGrantLimit
    }).subscribe({
      next: (res) => {
        this.isLimitsModalOpen = false;
        this.showAlert(res.message, 'success');
        this.openManageDrawer(this.selectedUser);
      }
    });
  }

  // Edit Codes & PIN
  openCodesModal(): void {
    this.code1 = this.selectedUser.code1 || '1111';
    this.code2 = this.selectedUser.code2 || '2222';
    this.code3 = this.selectedUser.code3 || '3333';
    this.code4 = this.selectedUser.code4 || '4444';
    this.code5 = this.selectedUser.code5 || '5555';
    this.pin = this.selectedUser.pin || '1234';
    this.isCodesModalOpen = true;
  }

  submitCodes(): void {
    this.http.put<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/codes`, {
      code1: this.code1,
      code2: this.code2,
      code3: this.code3,
      code4: this.code4,
      code5: this.code5,
      pin: this.pin
    }).subscribe({
      next: (res) => {
        this.isCodesModalOpen = false;
        this.showAlert(res.message, 'success');
        this.openManageDrawer(this.selectedUser);
      }
    });
  }

  // Toggle Status (Block / Unblock)
  toggleStatus(): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/status`, {}).subscribe({
      next: (res) => {
        this.selectedUser.status = res.newStatus;
        this.showAlert(res.message, 'success');
        this.fetchUsers();
      }
    });
  }

  // Toggle Dormant
  toggleDormant(): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/dormant`, {}).subscribe({
      next: (res) => {
        this.selectedUser.account_status = res.newStatus;
        this.showAlert(res.message, 'success');
        this.fetchUsers();
      }
    });
  }

  // Reset Password
  openPasswordModal(): void {
    this.newPassword = '';
    this.isPasswordModalOpen = true;
  }

  submitPassword(): void {
    if (!this.newPassword) return;
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/reset-password`, {
      password: this.newPassword
    }).subscribe({
      next: (res) => {
        this.isPasswordModalOpen = false;
        this.showAlert(res.message, 'success');
      }
    });
  }

  // Clear Account
  clearAccount(): void {
    if (!confirm(`Are you sure you want to clear balances for ${this.selectedUser.name}?`)) return;
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/clear`, {}).subscribe({
      next: (res) => {
        this.showAlert(res.message, 'success');
        this.openManageDrawer(this.selectedUser);
        this.fetchUsers();
      }
    });
  }

  // Impersonate User (One click Login as Client)
  impersonateUser(): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}/impersonate`, {}).subscribe({
      next: (res) => {
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          window.open('/user/dashboard', '_blank');
        }
      }
    });
  }

  // Delete User
  deleteUser(): void {
    if (!confirm(`Are you sure you want to PERMANENTLY delete user ${this.selectedUser.name} and all transaction records?`)) return;
    this.http.delete<any>(`https://backend-zpue.onrender.com/api/admin/users/${this.selectedUser.id}`).subscribe({
      next: (res) => {
        this.closeManageDrawer();
        this.showAlert(res.message, 'success');
        this.fetchUsers();
      }
    });
  }

  showAlert(msg: string, type: string): void {
    this.alertMessage = msg;
    this.alertType = type;
    setTimeout(() => { this.alertMessage = ''; }, 5000);
  }
}
