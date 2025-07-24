import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketOrderService } from '../../../services/ticket-order.service';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all',
  imports: [ CommonModule],
  templateUrl: './all.component.html',
  styleUrl: './all.component.css'
})
export class AllComponent {
  userId: string | null = null;
  selectedTab: string = 'all';
  ticketOrders: any[] = [];

  setTab(tab: string) {
    this.selectedTab = tab;
    this.onTabChange(tab);
  }
  constructor(private router: Router,private ticketOrderService: TicketOrderService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId !== null) {
      this.loadAllOrders(this.userId);
    } else {
      console.error('User ID is null, cannot load orders.');
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

  loadAllOrders(userId: string) {
    this.ticketOrderService.getTicketsByUserId(+userId).subscribe({
      next: (data) => {
        // Sắp xếp theo ngày giảm dần (mới nhất lên đầu)
        this.ticketOrders = data.sort((a: any, b: any) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
  }
}
