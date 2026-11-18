import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent {
  siteName = 'BankProX';

  loanAmount: number = 25000;
  interestRate: number = 5.99;
  loanTerm: number = 5;

  monthlyPayment: number = 483.21;
  totalInterest: number = 3992.60;
  totalPayment: number = 28992.60;

  calculateLoan(): void {
    if (this.loanAmount > 0 && this.interestRate > 0 && this.loanTerm > 0) {
      const monthlyRate = this.interestRate / 100 / 12;
      const numberOfPayments = this.loanTerm * 12;
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      this.monthlyPayment = (this.loanAmount * x * monthlyRate) / (x - 1);
      this.totalPayment = this.monthlyPayment * numberOfPayments;
      this.totalInterest = this.totalPayment - this.loanAmount;
    }
  }
}
