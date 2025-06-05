import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-ticket',
  imports: [CommonModule],
  templateUrl: './select-ticket.component.html',
  styleUrls: ['./select-ticket.component.css']
})
export class SelectTicketComponent {
  constructor(private router: Router) {}
  
  tickets: any[] = [
    { name: 'COURTSIDE', price: 1500000, quantity: 0 },
    { name: 'VIP - A1', price: 700000, quantity: 0 },
    { name: 'VIP - A2', price: 700000, quantity: 0 },
    { name: 'VIP - B', price: 700000, quantity: 0 },
    { name: 'PREMIUM - A1', price: 450000, quantity: 0 },
    { name: 'PREMIUM - A2', price: 450000, quantity: 0 },
  ];

  increaseQuantity(ticket: any): void {
    ticket.quantity++;
  }

  decreaseQuantity(ticket: any): void {
    if (ticket.quantity > 0) {
      ticket.quantity--;
    }
  }

  get totalAmount(): number {
    return this.tickets.reduce((total, ticket) => total + ticket.quantity * ticket.price, 0);
  }

  get hasSelection(): boolean {
    return this.tickets.some(ticket => ticket.quantity > 0);
  }

  get totalTicketCount(): number {
    return this.tickets.reduce((sum, t) => sum + t.quantity, 0);
  }

  backToDetails(): void {
    this.router.navigate(['/detail-ticket']);
  }
}
