import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);

  transferType = 'Domestic';
  amount: number | null = null;
  accountName = '';
  accountNumber = '';
  bankName = '';
  accountType = 'Online Banking';
  swiftCode = '';
  routingNumber = '';
  pin = '';
  notes = '';

  accountTypes = ['Online Banking', 'Checking Account', 'Savings Account', 'Fixed Deposit Account', 'Joint Account'];

  beneficiaries: any[] = [];
  savedTransferData: any = null;
  verificationSteps: any[] = [];
  currentStepIndex = 0;
  currentCodeInput = '';

  isPreviewOpen = false;
  isModalOpen = false;
  isProcessing = false;
  progressPercent = 0;
  isCompleted = false;
  receiptData: any = null;

  errorMessage = '';
  modalError = '';
  loading = false;
  modalLoading = false;

  setQuickAmount(val: number): void {
    this.amount = val;
  }

  setAllAmount(): void {
    this.amount = Math.floor(this.getUserBalance());
  }

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.http.get<any>('https://backend-zpue.onrender.com/api/user/beneficiaries').subscribe({
      next: (res) => {
        if (res.success) this.beneficiaries = res.data;
      },
      error: () => {
        // Fallback default sample beneficiaries if empty
        this.beneficiaries = [
          { name: 'Sarah Jenkins', account_number: '1099238472', bank_name: 'Chase Bank', routing_number: '021000021', initials: 'SJ' },
          { name: 'Marcus Sterling', account_number: '2093847192', bank_name: 'Bank of America', routing_number: '121000358', initials: 'MS' },
          { name: 'Elena Rostova', account_number: 'GB29NWBK60161331926819', bank_name: 'Barclays UK', swift_code: 'BARCGB22', initials: 'ER' }
        ];
      }
    });
  }

  selectBeneficiary(b: any): void {
    this.accountName = b.account_name || b.name;
    this.accountNumber = b.account_number;
    this.bankName = b.bank_name || '';
    this.swiftCode = b.swift_code || '';
    this.routingNumber = b.routing_number || '';
  }

  getUserBalance(): number {
    return this.auth.currentUser()?.account_bal || 124500;
  }

  getTransferFee(): number {
    if (!this.amount || this.amount <= 0) return 0;
    return this.transferType === 'Internal' ? 0 : Number((this.amount * 0.005).toFixed(2));
  }

  getTotalAmount(): number {
    if (!this.amount || this.amount <= 0) return 0;
    return this.amount + this.getTransferFee();
  }

  getRemainingBalance(): number {
    return Math.max(0, this.getUserBalance() - this.getTotalAmount());
  }

  openPreview(): void {
    this.errorMessage = '';
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid transfer amount.';
      return;
    }
    if (this.getTotalAmount() > this.getUserBalance()) {
      this.errorMessage = 'Insufficient funds for this transfer and processing fee.';
      return;
    }
    if (!this.accountNumber || !this.accountName) {
      this.errorMessage = 'Please specify the recipient account details.';
      return;
    }
    if (!this.pin || this.pin.length < 4) {
      this.errorMessage = 'Please enter your 4-digit security authorization PIN.';
      return;
    }

    this.isPreviewOpen = true;
  }

  closePreview(): void {
    this.isPreviewOpen = false;
  }

  confirmAndProcess(): void {
    this.isPreviewOpen = false;
    this.isProcessing = true;
    this.progressPercent = 15;

    const interval = setInterval(() => {
      if (this.progressPercent < 85) {
        this.progressPercent += 20;
      }
    }, 400);

    const payload = {
      transfer_type: this.transferType,
      amount: this.amount,
      pin: this.pin,
      recipient_account: this.accountNumber,
      account_name: this.accountName,
      bank_name: this.bankName,
      swift_code: this.swiftCode,
      routing_number: this.routingNumber
    };

    this.http.post<any>('https://backend-zpue.onrender.com/api/user/transfer/initiate', payload).subscribe({
      next: (res) => {
        clearInterval(interval);
        this.progressPercent = 100;
        setTimeout(() => {
          this.isProcessing = false;
          if (res.success) {
            this.savedTransferData = res.transferData;
            this.verificationSteps = res.steps || [];
            this.currentStepIndex = 0;
            this.currentCodeInput = '';
            this.modalError = '';

            if (this.verificationSteps.length > 0) {
              this.isModalOpen = true;
            } else {
              this.finalizeTransfer();
            }
          }
        }, 500);
      },
      error: (err) => {
        clearInterval(interval);
        this.isProcessing = false;
        this.errorMessage = err.error?.message || 'Transfer failed. Check balance or authorization PIN.';
      }
    });
  }

  verifyCurrentStep(): void {
    this.modalError = '';
    if (!this.currentCodeInput) {
      this.modalError = 'Please enter the authorization code to proceed.';
      return;
    }

    this.modalLoading = true;
    const currentStep = this.verificationSteps[this.currentStepIndex];

    this.http.post<any>('https://backend-zpue.onrender.com/api/user/transfer/verify-code', {
      code_type: currentStep.code,
      code_value: this.currentCodeInput
    }).subscribe({
      next: (res) => {
        this.modalLoading = false;
        this.currentCodeInput = '';
        if (this.currentStepIndex < this.verificationSteps.length - 1) {
          this.currentStepIndex++;
        } else {
          this.finalizeTransfer();
        }
      },
      error: (err) => {
        this.modalLoading = false;
        this.modalError = err.error?.message || 'Invalid authorization code entered.';
      }
    });
  }

  finalizeTransfer(): void {
    this.modalLoading = true;
    this.http.post<any>('https://backend-zpue.onrender.com/api/user/transfer/complete', this.savedTransferData).subscribe({
      next: (res) => {
        this.modalLoading = false;
        this.isModalOpen = false;
        this.isCompleted = true;
        this.receiptData = {
          ...this.savedTransferData,
          txn_id: res.txn_id || ('TXN-' + Math.floor(10000000 + Math.random() * 90000000)),
          date: new Date()
        };
      },
      error: (err) => {
        this.modalLoading = false;
        this.modalError = err.error?.message || 'Failed to finalize transaction.';
      }
    });
  }

  printReceipt(): void {
    window.print();
  }

  resetForm(): void {
    this.amount = null;
    this.accountName = '';
    this.accountNumber = '';
    this.bankName = '';
    this.swiftCode = '';
    this.routingNumber = '';
    this.pin = '';
    this.isCompleted = false;
    this.receiptData = null;
  }
}
