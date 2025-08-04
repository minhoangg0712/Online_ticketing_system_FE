import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketOrderService } from '../../../services/ticket-order.service';
import { isPlatformBrowser } from '@angular/common';
import { StatusTranslatePipe } from '../../../../status-translate.pipe';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule, StatusTranslatePipe],
  templateUrl: './all.component.html',
  styleUrl: './all.component.css'
})
export class AllComponent implements OnInit {
  userId!: number;
  selectedTab: string = 'all';
  ticketOrders: any[] = [];

  constructor(private ticketOrderService: TicketOrderService,
    @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = localStorage.getItem('userId');
      if (storedId) {
        this.userId = +storedId;
        this.loadAllTickets(this.userId);
      } else {
        console.error('No userId found in localStorage');
      }
    }
  }

  setTab(tab: string) {
    this.selectedTab = tab;
    this.onTabChange(tab);
  }

  private onTabChange(tab: string) {
    switch (tab) {
      case 'coming':
        console.log('Loading all tickets...');
        break;
      case 'ended':
        console.log('Loading successful tickets...');
        break;
      default:
        console.log('Unknown tab:', tab);
    }
  }

  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

  loadAllTickets(userId: number) {
    this.ticketOrderService.getTicketsByUserId(userId).subscribe({
      next: (res) => {
        const orders = res.data || [];
        this.ticketOrders = orders.sort((a: any, b: any) => {
          const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
          const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
          return dateB - dateA;
        });
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
  }
}
