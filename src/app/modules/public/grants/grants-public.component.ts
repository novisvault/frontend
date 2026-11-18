import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-grants-public',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grants-public.component.html',
  styleUrls: ['./grants-public.component.scss']
})
export class GrantsPublicComponent {
  siteName = 'BankProX';
}
