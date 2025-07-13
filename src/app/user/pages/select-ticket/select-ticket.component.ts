import { Component, OnInit, HostListener,ViewChild  } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-ticket',
  imports: [CommonModule, ToastNotificationComponent],
  templateUrl: './select-ticket.component.html',
  styleUrls: ['./select-ticket.component.css']
})
export class SelectTicketComponent {
  eventId!: number;
  eventData: any = {};
  ticketList: any[] = [];
  events: any[] = [];

  @ViewChild('notification') notification!: ToastNotificationComponent;

  constructor(private router: Router,
    private eventsService: EventsService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.loadEventDetail(this.eventId);

      // Check để tránh lỗi trong SSR
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  
  tickets: any[] = [
    { name: 'COURTSIDE', price: 1500000, quantity: 0 },
    { name: 'VIP - A1', price: 700000, quantity: 0 },
    { name: 'VIP - A2', price: 700000, quantity: 0 },
    { name: 'VIP - B', price: 700000, quantity: 0 },
    { name: 'PREMIUM - A1', price: 450000, quantity: 0 },
    { name: 'PREMIUM - A2', price: 450000, quantity: 0 },
  ];

  loadEventDetail(id: number): void {
    this.eventsService.getEventById(id).subscribe({
      next: (res) => {
        const event = res?.data;

        // Lấy giá đầu tiên từ ticketPrices
        const ticketPricesObj = event.ticketPrices || {};
        const price = Object.values(ticketPricesObj)[0] || 0;

        // Chuyển ticketPrices object thành mảng để hiển thị danh sách
        const ticketPrices = Object.entries(ticketPricesObj).map(([type, price]) => ({
          type,
          price,
          quantity: 0
        }));

        const fullAddress = event.address || event.addressName || '';

        const parts = fullAddress.split(',').map((part: string) => part.trim());

        // Đảm bảo có ít nhất 3 phần để lấy SECC - Q7
        let addressDetail = '';
        let addressName = '';

        if (parts.length >= 3) {
          addressDetail = parts[1]; // phần SECC - Q7
          // ghép lại Quận 7 + từ Ward 8 trở đi
          addressName = [parts[0], ...parts.slice(2)].join(', ');
        } else {
          addressName = fullAddress; // fallback
        }

        this.eventData = {
          id: event.eventId,
          eventName: event.eventName,
          description: event.description,
          startTime: event.startTime,
          backgroundUrl: event.backgroundUrl,
          organizerName: event.organizerName,
          organizerBio: event.organizerBio,
          organizerAvatarUrl: event.organizerAvatarUrl,

          // ✅ Tách theo yêu cầu
          addressDetail: addressDetail,
          addressName: addressName,

          price,
          ticketPrices,
        };
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sự kiện:', err);
      }
    });
  }


  increaseQuantity(ticket: any): void {
    const index = this.eventData.ticketPrices.findIndex((t: any) => t.type === ticket.type);
    if (index !== -1) {
      this.eventData.ticketPrices[index].quantity++;
    }
  }

  decreaseQuantity(ticket: any): void {
    const index = this.eventData.ticketPrices.findIndex((t: any) => t.type === ticket.type);
    if (index !== -1 && this.eventData.ticketPrices[index].quantity > 0) {
      this.eventData.ticketPrices[index].quantity--;
    }
  }


  get totalAmount(): number {
    return (this.eventData.ticketPrices || []).reduce(
      (total: number, ticket: any) => total + ticket.quantity * ticket.price, 0
    );
  }

  get hasSelection(): boolean {
    return (this.eventData.ticketPrices || []).some((ticket: any) => ticket.quantity > 0);
  }

  get totalTicketCount(): number {
    return (this.eventData.ticketPrices || []).reduce((sum: number, t: any) => sum + t.quantity, 0);
  }

  backToDetails(eventId: number): void {
    this.router.navigate(['/detail-ticket', eventId]);
  }

  onNotificationClose() {}
}
