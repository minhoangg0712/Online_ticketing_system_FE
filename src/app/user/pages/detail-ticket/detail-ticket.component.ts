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

  toggleTicket(index: number): void {
    this.ticketList[index].isExpanded = !this.ticketList[index].isExpanded;
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

        // Lấy giá đầu tiên từ ticketPrices
        const ticketPricesObj = event.ticketPrices || {};
        const price = Object.values(ticketPricesObj)[0] || 0;

        // Chuyển ticketPrices object thành mảng để hiển thị danh sách
        const ticketPrices = Object.entries(ticketPricesObj).map(([type, price]) => ({
          type,
          price
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


  loadEvents() {
    this.eventsService.getRecommendedEvents(
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
      console.log('Thực hiện hành động...');
    } else {
      this.notification.showNotification(
        'Bạn phải đăng nhập để sử dụng chức năng này.',
        5000,
        "warning",
      );
    }
  }

  onNotificationClose() {}
}
