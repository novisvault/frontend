import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  siteName = 'BankProX';
  activeCategory = 'about';

  faqs: Record<string, Array<{ question: string; answer: string; open?: boolean }>> = {
    about: [
      {
        question: 'What is BankProX?',
        answer: 'BankProX is a modern digital banking platform offering secure, high-yield banking services, global wire transfers, and personal & business financing.'
      },
      {
        question: 'Is my money safe and insured with BankProX?',
        answer: 'Yes! All deposit accounts are FDIC insured up to $250,000 per depositor, backed by 256-bit military-grade encryption and 24/7 fraud monitoring.'
      },
      {
        question: 'Are there any hidden monthly maintenance fees?',
        answer: 'No. We believe in honest, transparent banking. Standard checking and savings accounts have zero monthly maintenance fees and zero minimum balance penalties.'
      }
    ],
    account: [
      {
        question: 'How do I open an account?',
        answer: 'You can open an account in less than 3 minutes online by clicking the "Open Account" button, verifying your identity with standard KYC documents, and funding your account.'
      },
      {
        question: 'What documents are required for KYC verification?',
        answer: 'A government-issued ID (Passport, Driver’s License, or National ID) and proof of address (utility bill or bank statement within the last 3 months).'
      },
      {
        question: 'Can I open a joint or business account?',
        answer: 'Yes, we support both individual accounts and corporate/business checking and high-yield savings accounts.'
      }
    ],
    deposit: [
      {
        question: 'How can I deposit money into my account?',
        answer: 'You can deposit funds via domestic ACH, international wire transfer, mobile check deposit, debit card, or cryptocurrency.'
      },
      {
        question: 'How long do deposits take to clear?',
        answer: 'Domestic transfers and crypto deposits typically reflect immediately or within 1 business day. Wire transfers clear within 24-48 business hours.'
      }
    ],
    withdrawal: [
      {
        question: 'How do I withdraw or transfer funds?',
        answer: 'You can initiate domestic transfers, wire transfers, or card withdrawals 24/7 through your dashboard under the Transfer section.'
      },
      {
        question: 'What verification is required for international transfers?',
        answer: 'For your security, high-volume international transfers may require verification codes including OTP, COT, and IMF authorization codes.'
      }
    ]
  };

  setCategory(category: string): void {
    this.activeCategory = category;
  }

  toggleFaq(item: { open?: boolean }): void {
    item.open = !item.open;
  }
}
