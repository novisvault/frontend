import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss']
})
export class GrantComponent implements OnInit {
  private http = inject(HttpClient);

  grantLimit = 50000;
  hasApplication = false;
  latestStatus: string | null = null;
  applications: any[] = [];
  loading = true;

  activeTab: 'individual' | 'company' = 'individual';

  // Individual Form
  indAmount: number | null = null;
  indMission = '';
  programFunding = true;
  equipmentFunding = false;
  researchFunding = false;
  communityOutreach = false;

  // Company Form
  compName = '';
  compEin = '';
  compAmount: number | null = null;
  compAddress = '';
  compMission = '';

  message = '';
  isSuccess = false;
  submitting = false;

  ngOnInit(): void {
    this.fetchGrantData();
  }

  fetchGrantData(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/grants').subscribe({
      next: (res) => {
        if (res.success) {
          this.grantLimit = res.data.grant_limit;
          this.hasApplication = res.data.hasApplication;
          this.latestStatus = res.data.latestStatus;
        }
        this.fetchApplications();
      },
      error: () => this.loading = false
    });
  }

  fetchApplications(): void {
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/grants/my-applications').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.applications = res.data;
      },
      error: () => this.loading = false
    });
  }

  submitIndividual(): void {
    this.message = '';
    if (!this.indAmount || this.indAmount <= 0) {
      this.message = 'Please enter a valid requested grant amount.';
      this.isSuccess = false;
      return;
    }

    this.submitting = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/grants/individual', {
      requested_amount: this.indAmount,
      mission_statement: this.indMission,
      program_funding: this.programFunding,
      equipment_funding: this.equipmentFunding,
      research_funding: this.researchFunding,
      community_outreach: this.communityOutreach
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.isSuccess = true;
        this.message = res.message;
        this.fetchGrantData();
      },
      error: (err) => {
        this.submitting = false;
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to submit grant application.';
      }
    });
  }

  submitCompany(): void {
    this.message = '';
    if (!this.compName || !this.compAmount || this.compAmount <= 0) {
      this.message = 'Please provide company name and requested amount.';
      this.isSuccess = false;
      return;
    }

    this.submitting = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/grants/company', {
      legal_name: this.compName,
      ein: this.compEin,
      requested_amount: this.compAmount,
      mailing_address: this.compAddress,
      mission_statement: this.compMission
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.isSuccess = true;
        this.message = res.message;
        this.fetchGrantData();
      },
      error: (err) => {
        this.submitting = false;
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to submit grant application.';
      }
    });
  }
}
