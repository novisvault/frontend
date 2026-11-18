import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cards-public',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cards-public.component.html',
  styleUrls: ['./cards-public.component.scss']
})
export class CardsPublicComponent {
  siteName = 'BankProX';
}
