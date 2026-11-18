import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cards.component.html',
  styleUrls: ['./admin-cards.component.scss']
})
export class AdminCardsComponent implements OnInit {
  private http = inject(HttpClient);

  cards: any[] = [];
  loading = true;
  message = '';

  ngOnInit(): void {
    this.fetchCards();
  }

  fetchCards(): void {
    this.loading = true;
    this.http.get<any>('https://backend-zpue.onrender.com/api/admin/cards').subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.cards = res.data;
      },
      error: () => this.loading = false
    });
  }

  process(id: number, status: string): void {
    this.http.post<any>(`https://backend-zpue.onrender.com/api/admin/cards/${id}/process`, { status }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.fetchCards();
        setTimeout(() => { this.message = ''; }, 4000);
      }
    });
  }
}
