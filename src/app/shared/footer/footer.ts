import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})

export class FooterComponent {
  brandName: string = 'Verveance';
  currentYear: number = new Date().getFullYear();
  newsletterEmail: string = '';

  constructor() { }

  subscribeToNewsletter(event: Event): void {
    event.preventDefault();
    if (this.newsletterEmail) {
      console.log('Newsletter subscribed with:', this.newsletterEmail);
      alert(`Thank you for subscribing, ${this.newsletterEmail}!`);
      this.newsletterEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
}