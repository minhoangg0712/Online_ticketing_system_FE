import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-ticket',
  imports: [CommonModule],
  templateUrl: './detail-ticket.component.html',
  styleUrl: './detail-ticket.component.css'
})
export class DetailTicketComponent implements OnInit {
  expanded = false;
  eventsData: any[] = [];

  tickets = [
    { zone: 'Zone - GA B2', originalPrice: '899,000 đ', discountedPrice: '449,500 đ', discount: '50%' },
    { zone: 'Zone - GA C1', originalPrice: '599,000 đ', discountedPrice: '299,500 đ', discount: '50%' },
    { zone: 'Zone - GA C2', originalPrice: '599,000 đ', discountedPrice: '299,500 đ', discount: '50%' },
    { zone: 'Zone - GA A1', originalPrice: '1,900,000 đ', discountedPrice: '950,000 đ', discount: '50%' },
    { zone: 'Zone - GA A2', originalPrice: '1,900,000 đ', discountedPrice: '950,000 đ', discount: '50%' },
    { zone: 'Zone - GA B1', originalPrice: '899,000 đ', discountedPrice: '449,500 đ', discount: '50%' }
  ];

  get displayedTickets() {
    return this.expanded ? this.tickets : this.tickets.slice(0, 3);
  }

  toggleRows(): void {
    this.expanded = !this.expanded;
  }

  ticketList = [
    { name: 'EARLY BIRD - Zone - GA A1', price: '950.000 đ', isExpanded: false },
    { name: 'EARLY BIRD - Zone - GA A2', price: '950.000 đ', isExpanded: false },
    { name: 'EARLY BIRD - Zone - GA B1', price: '449.500 đ', isExpanded: false },
    { name: 'EARLY BIRD - Zone - GA C1', price: '299.500 đ', isExpanded: false },
    { name: 'EARLY BIRD - VIP A Seating + Table - A1', price: '4.800.000 đ', isExpanded: false },
    { name: 'EARLY BIRD - VIP A Seating + Table - A2', price: '4.800.000 đ', isExpanded: false },
    { name: 'EARLY BIRD - VIP B Seating Chairs - B1', price: '2.000.000 đ', isExpanded: false },
    { name: 'EARLY BIRD - VIP B Seating Chairs - B2', price: '2.000.000 đ', isExpanded: false },
    { name: 'EARLY BIRD - Zone - GA B2', price: '449.500 đ', isExpanded: false },
    { name: 'EARLY BIRD - Zone - GA C2', price: '299.500 đ', isExpanded: false }
  ];

  toggleTicket(index: number): void {
    this.ticketList[index].isExpanded = !this.ticketList[index].isExpanded;
  }

  organizer = {
    image: 'https://storage.googleapis.com/a1aa/image/4381ee43-14c4-4793-40a7-c8d81c45bd65.jpg',
    alt: 'LE NOM logo black and white with text LENOM INTERGRATED COMMUNICATION GROUP',
    name: 'LE NOM',
    description: 'LENOM INTERGRATED COMMUNICATION GROUP'
  };

  constructor() { }

  ngOnInit(): void {}
}
