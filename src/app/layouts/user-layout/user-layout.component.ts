import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  user = this.auth.currentUser;

  sidebarOpen = false;
  mobileMenuOpen = false;
  notificationsOpen = false;
  userDropdownOpen = false;
  darkMode = signal<boolean>(false);

  unreadNotifications = [
    { title: 'Security Alert: Encrypted Login', time: 'Just now', type: 'info', icon: 'fa-shield-check' },
    { title: 'Monthly Statement Generated', time: '2 hours ago', type: 'success', icon: 'fa-file-invoice' },
    { title: 'Yield Credited (+3.75% APY)', time: 'Yesterday', type: 'success', icon: 'fa-arrow-down' }
  ];

  ngOnInit(): void {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.darkMode.set(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    const newVal = !this.darkMode();
    this.darkMode.set(newVal);
    localStorage.setItem('darkMode', String(newVal));
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.userDropdownOpen = false;
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
    this.notificationsOpen = false;
  }

  closeDropdowns(): void {
    this.notificationsOpen = false;
    this.userDropdownOpen = false;
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'BX';
    const first = u.name ? u.name.charAt(0) : 'B';
    const last = u.lastname ? u.lastname.charAt(0) : 'X';
    return (first + last).toUpperCase();
  }

  getMaskedAccountNumber(): string {
    const num = this.user()?.account_number;
    if (!num) return '1019';
    const str = String(num);
    return str.length > 4 ? str.slice(-4) : str;
  }

  logout(): void {
    this.auth.logout();
  }
}
