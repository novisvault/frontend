import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  private http = inject(HttpClient);

  plans: any[] = [];
  userPlans: any[] = [];
  loading = true;

  selectedPlan: any = null;
  investAmount: number | null = null;
  isBuyModalOpen = false;
  message = '';
  isSuccess = false;

  ngOnInit(): void {
    this.fetchPlans();
    this.fetchUserPlans();
  }

  fetchPlans(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/plans').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.plans = res.data;
      },
      error: () => this.loading = false
    });
  }

  fetchUserPlans(): void {
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/plans/my-plans').subscribe({
      next: (res) => {
        if (res.success) this.userPlans = res.data;
      }
    });
  }

  getPlanReturn(p: any): string {
    if (!p) return 'N/A';
    if (p.expected_return) return p.expected_return;
    const amount = p.increment_amount || p.minr || '10';
    const type = p.increment_type === 'Percentage' ? '%' : (p.increment_type === 'Amount' ? '$' : '%');
    return `${amount}${type}`;
  }

  openBuyModal(plan: any): void {
    this.selectedPlan = plan;
    this.investAmount = plan.min_price;
    this.message = '';
    this.isBuyModalOpen = true;
  }

  submitBuy(): void {
    this.message = '';
    if (!this.investAmount || this.investAmount <= 0) return;

    this.http.post<any>('https://backend-zpue.onrender.com/api/user/plans/buy', {
      plan_id: this.selectedPlan.id,
      amount: this.investAmount
    }).subscribe({
      next: (res) => {
        this.isSuccess = true;
        this.message = res.message;
        setTimeout(() => {
          this.isBuyModalOpen = false;
          this.fetchUserPlans();
        }, 1500);
      },
      error: (err) => {
        this.isSuccess = false;
        this.message = err.error?.message || 'Failed to activate plan.';
      }
    });
  }
}
