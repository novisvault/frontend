import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-virtual-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  private http = inject(HttpClient);

  cards: any[] = [];
  cardSettings: any = null;
  totalBalance = 0;
  loading = true;

  // Modals
  isApplyModalOpen = false;
  isTopupModalOpen = false;
  selectedCard: any = null;

  // Apply Form
  cardType = 'visa';
  cardLevel = 'standard';
  dailyLimit = 5000;

  // Topup Form
  topupAmount: number | null = null;
  topupMessage = '';
  applyMessage = '';

  ngOnInit(): void {
    this.fetchCards();
  }

  fetchCards(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/cards').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.cards = res.data.cards;
          this.cardSettings = res.data.settings;
          this.totalBalance = res.data.totalBalance;
        }
      },
      error: () => this.loading = false
    });
  }

  openApplyModal(): void {
    this.applyMessage = '';
    this.isApplyModalOpen = true;
  }

  submitApplication(): void {
    this.applyMessage = '';
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/cards/apply', {
      card_type: this.cardType,
      card_level: this.cardLevel,
      daily_limit: this.dailyLimit,
      currency: 'USD'
    }).subscribe({
      next: (res) => {
        this.isApplyModalOpen = false;
        this.fetchCards();
      },
      error: (err) => {
        this.applyMessage = err.error?.message || 'Failed to submit application.';
      }
    });
  }

  toggleStatus(card: any, status: string): void {
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/cards/toggle-status', {
      cardId: card.id,
      status: status
    }).subscribe({
      next: () => this.fetchCards()
    });
  }

  openTopup(card: any): void {
    this.selectedCard = card;
    this.topupAmount = null;
    this.topupMessage = '';
    this.isTopupModalOpen = true;
  }

  submitTopup(): void {
    if (!this.topupAmount || this.topupAmount <= 0) return;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/cards/topup', {
      cardId: this.selectedCard.id,
      amount: this.topupAmount
    }).subscribe({
      next: () => {
        this.isTopupModalOpen = false;
        this.fetchCards();
      },
      error: (err) => {
        this.topupMessage = err.error?.message || 'Failed to top up card.';
      }
    });
  }
}
