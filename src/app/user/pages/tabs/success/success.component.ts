import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketOrderService } from '../../../services/ticket-order.service';
import { isPlatformBrowser } from '@angular/common';
import { StatusTranslatePipe } from '../../../../status-translate.pipe';

@Component({
  selector: 'app-success',
  imports: [ CommonModule, StatusTranslatePipe],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  userId!: number;
  ticketOrders: any[] = [];
  selectedTab: string = 'all';

  setTab(tab: string) {
    this.selectedTab = tab;
    this.onTabChange(tab);
  }
  constructor(private ticketOrderService: TicketOrderService,
    @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = localStorage.getItem('userId');
      if (storedId) {
        this.userId = +storedId;
        this.loadSuccessTickets(this.userId);
      } else {
        console.error('No userId found in localStorage');
      }
    }
  }

  private onTabChange(tab: string) {
    switch(tab) {
      case 'coming':
        console.log('Loading all tickets...');
        // Logic cho tab "Tất cả"
        break;
      case 'ended':
        console.log('Loading successful tickets...');
        // Logic cho tab "Thành công"
        break;
      default:
        console.log('Unknown tab:', tab);
    }
  }

  // Method để check xem tab có đang active không
  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

  loadSuccessTickets(userId: number) {
    this.ticketOrderService.getTicketsByUserId(userId).subscribe({
      next: (res) => {
        const orders = res.data || [];
        this.ticketOrders = orders
          .filter((order: any) => order.status === 'paid')
          .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
          console.log("Đã load được success tickets", this.ticketOrders)
      },
      error: (err) => {
        console.error('Error loading pending orders:', err);
      }
    });
  }
}
