import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  private http = inject(HttpClient);

  activeTab: 'codes' | 'general' = 'codes';
  loading = true;
  message = '';

  // Settings State matching transfercodes.blade.php
  site_name = 'BankProX';
  currency = '$';
  s_currency = 'USD';

  code1 = 'COT Code';
  code2 = 'Tax Clearance Code';
  code3 = 'IMF Clearance Code';
  code4 = 'Anti-Terrorist Clearance';
  code5 = 'Anti-Money Laundering';

  code1status = '1';
  code2status = '1';
  code3status = '1';
  code4status = '1';
  code5status = '1';

  code1message = 'Please provide your Cost of Transfer (COT) authorization code.';
  code2message = 'Federal Tax Clearance certificate verification required.';
  code3message = 'International Monetary Fund (IMF) cross-border clearance code.';
  code4message = 'Anti-Terrorist Financing clearance verification required.';
  code5message = 'Anti-Money Laundering (AML) regulatory compliance clearance.';

  otp = '1';

  ngOnInit(): void {
    this.fetchSettings();
  }

  fetchSettings(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/settings').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data?.settings) {
          const s = res.data.settings;
          this.site_name = s.site_name || this.site_name;
          this.currency = s.currency || this.currency;
          this.s_currency = s.s_currency || this.s_currency;
          this.code1 = s.code1 || this.code1;
          this.code2 = s.code2 || this.code2;
          this.code3 = s.code3 || this.code3;
          this.code4 = s.code4 || this.code4;
          this.code5 = s.code5 || this.code5;
          this.code1status = String(s.code1status ?? '1');
          this.code2status = String(s.code2status ?? '1');
          this.code3status = String(s.code3status ?? '1');
          this.code4status = String(s.code4status ?? '1');
          this.code5status = String(s.code5status ?? '1');
          this.code1message = s.code1message || this.code1message;
          this.code2message = s.code2message || this.code2message;
          this.code3message = s.code3message || this.code3message;
          this.code4message = s.code4message || this.code4message;
          this.code5message = s.code5message || this.code5message;
          this.otp = String(s.otp ?? '1');
        }
      },
      error: () => this.loading = false
    });
  }

  saveSettings(): void {
    this.http.put<any>('https://backend-zpue.onrender.com/api/admin/settings', {
      site_name: this.site_name,
      currency: this.currency,
      s_currency: this.s_currency,
      code1: this.code1,
      code2: this.code2,
      code3: this.code3,
      code4: this.code4,
      code5: this.code5,
      code1status: this.code1status,
      code2status: this.code2status,
      code3status: this.code3status,
      code4status: this.code4status,
      code5status: this.code5status,
      code1message: this.code1message,
      code2message: this.code2message,
      code3message: this.code3message,
      code4message: this.code4message,
      code5message: this.code5message,
      otp: this.otp
    }).subscribe({
      next: (res) => {
        this.message = res.message;
        setTimeout(() => { this.message = ''; }, 4000);
      }
    });
  }
}
