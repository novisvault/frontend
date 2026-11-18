import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  siteName = 'BankProX';
  contactEmail = 'support@bankprox.com';

  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;

  onSubmit(): void {
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
      this.form = { name: '', email: '', subject: '', message: '' };
      alert('Thank you for contacting us. We will get back to you within 24 hours!');
    }, 800);
  }
}
