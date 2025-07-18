import { Component, OnInit, HostListener,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-detail-ticket',
  imports: [CommonModule, ToastNotificationComponent],
  templateUrl: './detail-ticket.component.html',
  styleUrl: './detail-ticket.component.css'
})
export class DetailTicketComponent implements OnInit {
  eventId!: number;
  eventData: any = {};
  ticketList: any[] = [];
  events: any[] = [];

  expanded = false;
  showHeader = false;
  isMainExpanded: boolean = true;
  @ViewChild('notification') notification!: ToastNotificationComponent;
  
  showNotification = false;
  notificationMessage = 'Bạn phải đăng nhập để sử dụng chức năng này.';

  get displayedTickets() {
    const tickets = this.eventData.ticketPrices || [];
    return this.expanded ? tickets : tickets.slice(0, 3);
  }

  toggleRows(): void {
    this.expanded = !this.expanded;
  }

  toggleTicket(index: number): void {
    this.eventData.ticketPrices[index].isExpanded = !this.eventData.ticketPrices[index].isExpanded;
  }

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute,
    private eventsService: EventsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.loadEventDetail(this.eventId);

      // Check để tránh lỗi trong SSR
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    this.loadEvents(); // Gọi 1 lần duy nhất
  }

  loadEventDetail(id: number): void {
    this.eventsService.getEventById(id).subscribe({
      next: (res) => {
        const event = res?.data;

        const ticketPricesObj = event.ticketPrices || {};
        const ticketsSoldObj = event.ticketsSold || {};
        const ticketsTotalObj = event.ticketsTotal || {};

        const ticketPrices = Object.entries(ticketPricesObj).map(([type, price]) => {
          const sold = ticketsSoldObj[type] || 0;
          const total = ticketsTotalObj[type] || 0;
          const available = total - sold;

          return {
            type,
            price,
            total,
            sold,
            available,
            isSoldOut: available <= 0
          };
        });

        const allSoldOut = ticketPrices.every(ticket => ticket.isSoldOut);

        const price = Math.min(...ticketPrices.map(v => Number(v.price))) || 0;

        const fullAddress = event.address || event.addressName || '';
        const parts = fullAddress.split(',').map((part: string) => part.trim());

        let addressDetail = '';
        let addressName = '';

        if (parts.length >= 3) {
          addressDetail = parts[1];
          addressName = [parts[0], ...parts.slice(2)].join(', ');
        } else {
          addressName = fullAddress;
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

          addressDetail: addressDetail,
          addressName: addressName,

          price,
          ticketPrices,
          allSoldOut,
          isExpanded: false
        };

      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sự kiện:', err);
      }
    });
  }

  loadEvents() {
    this.eventsService.getRecommendedEvents(
      '', 
      '', 
      '', 
      '', 
      '', 
      '',
      1, 
      12 
    ).subscribe(res => {
      this.events = res?.data?.listEvents || [];
      // Map lại nếu cần, đảm bảo có đủ các trường
      this.events = this.events.map((event: any) => ({
        id: event.eventId,
        eventName: event.eventName,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        category: event.category,
        status: event.status,
        approval_status: event.approval_status,
        backgroundUrl: event.backgroundUrl,
        address: event.address || event.addressName,
        addressDetail: event.addressDetail,
        price: event.minPrice
      }));
    });
  }

  promotionalBannerUrl = 'https://storage.googleapis.com/a1aa/image/42737dff-09dd-4692-9d1c-4f174cd415e5.jpg';

  onLoadMoreEvents(){
    this.router.navigate(['/home']);
  }

  onEventClick(eventId: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/detail-ticket', eventId]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showHeader = scrollPosition > 600;
  }

  toggleMainSection(): void {
    this.isMainExpanded = !this.isMainExpanded;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  needLoginToBuyTicket() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/slider-captcha'], {
        queryParams: { eventId: this.eventId } 
      });
    } else {
      this.notification.showNotification(
        'Bạn phải đăng nhập để sử dụng chức năng này.',
        5000,
        "warning",
      );
    }
  }

  isAllTicketsSoldOut(): boolean {
    return this.eventData.ticketPrices?.every((ticket: any) => ticket.isSoldOut);
  }

  eventHasEnded(): boolean {
    const now = new Date();
    const eventDate = new Date(this.eventData.startTime);
    return now > eventDate;
  }

  getGoogleMapUrl(addressDetail: string, addressName: string): string {
    const fullAddress = `${addressDetail}, ${addressName}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  }

  onNotificationClose() {}
}
