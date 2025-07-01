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
      this.eventId = +params['id']; // lấy từ URL
      this.loadEventDetail(this.eventId);
    });
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

  events = [
    {
      id: 1,
      title: 'A COMPLETE GUIDE FOR SUCCESSFUL PROJECT MANAGEMENT',
      price: 'Từ 3.560.000đ',
      date: '21 tháng 10, 2024',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/25b0320f-4ff5-4114-f511-0b43af3cde03.jpg',
      imageAlt: 'Woman speaking at a project presentation, side view with a microphone'
    },
    {
      id: 2,
      title: 'ART WORKSHOP "MOMOFUKU STYLE BASIL RASBERRY CAKE"',
      price: 'Từ 420.000đ',
      date: '30 tháng 05, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/bc0c6adc-becc-4e93-a275-2d6b8c3e22f0.jpg',
      imageAlt: 'Momofuku style basil raspberry cake with eggs and knife on table'
    },
    {
      id: 3,
      title: 'SÂN KHẤU THIÊN ĐĂNG : CHUYỆN ĐÒ ĐỊNH MỆNH',
      price: 'Từ 330.000đ',
      date: '30 tháng 05, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/a99b80d3-9161-4adf-363b-a8ca1b2d7281.jpg',
      imageAlt: 'Movie poster with a large eye and dark background'
    },
    {
      id: 4,
      title: '1900 FUTURE HITS #70: JUN PHẠM | FRIDAY 30.05.2025',
      price: 'Từ 800.000đ',
      date: '30 tháng 05, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/3b234bdc-6539-476f-317f-38d514b8d8ca.jpg',
      imageAlt: 'Young man with clock background and red accent'
    },
    {
      id: 5,
      title: '[VIVIAN VU\'S CANDLES] WORKSHOP LÀM NẾN THƠM VÀ SOAP HANDMADE',
      price: 'Từ 315.000đ',
      date: '31 tháng 05, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/c1063538-9467-44a1-bbe3-4e7bfffaff58.jpg',
      imageAlt: 'Handmade workshop with candle and decorative elements'
    },
    {
      id: 6,
      title: 'AQUAFINA VIETNAM INTERNATIONAL FASHION WEEK XUÂN HÈ 2025',
      price: 'Từ 500.000đ',
      date: '05 tháng 06, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/a95e54c4-99f7-4a43-1c80-76f692c33f2e.jpg',
      imageAlt: 'Aquafina Vietnam International Fashion Week banner with white and blue colors'
    },
    {
      id: 7,
      title: 'Nhà Hát Kịch IDECAF: TÂM CẢM ĐẠI CHIẾN!',
      price: 'Từ 270.000đ',
      date: '06 tháng 06, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/f01d71b1-4f93-40db-c261-8389230074b6.jpg',
      imageAlt: 'Theater play Tâm Cảm Đại Chiến cast photo with green background'
    },
    {
      id: 8,
      title: 'SHOPEE - BRAND X CREATOR CONFERENCE 2025',
      price: 'Từ 1.200.000đ',
      date: '19 tháng 06, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/793bc483-c516-4400-ceae-f746b265372b.jpg',
      imageAlt: 'Shopee Brand X Creator Conference 2025 with orange theme and logo'
    },
    {
      id: 9,
      title: 'FAMILY RETREAT IN THE NATURE',
      price: 'Từ 3.200.000đ',
      date: '19 tháng 06, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/093c64c2-01ec-419c-6e1b-3359e13f96e6.jpg',
      imageAlt: 'Family retreat in the nature with forest view and text overlay'
    },
    {
      id: 10,
      title: 'LIVESHOW "801" - Bùi Công Nam & Thanh Duy _ Special Guest: Uyên Linh',
      price: 'Từ 800.000đ',
      date: '20 tháng 06, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/53b06c33-a691-4a6c-0dd0-27d38c6a430f.jpg',
      imageAlt: 'Liveshow 801 with three people and sunflower'
    },
    {
      id: 11,
      title: 'FUTURE WITH AI: AI & TƯƠNG LAI DOANH NGHIỆP - Chiến lược vượt sóng dẫn đầu...',
      price: 'Từ 128.000đ',
      date: '21 tháng 06, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/3d534dfd-6136-4f39-30f8-6677ea20737d.jpg',
      imageAlt: 'Future with AI conference with two men and blue background'
    },
    {
      id: 12,
      title: '[TP.HCM] Dệt Nắng - Nối Charity Foundation 2025',
      price: 'Từ 479.000đ',
      date: '07 tháng 07, 2025',
      imageUrl: 'https://storage.googleapis.com/a1aa/image/bf8c85a0-f526-4f21-c48c-88a8f01efb85.jpg',
      imageAlt: 'TPHCM Dệt Nắng Nối Charity Foundation collage photos'
    }
  ];

  promotionalBannerUrl = 'https://storage.googleapis.com/a1aa/image/42737dff-09dd-4692-9d1c-4f174cd415e5.jpg';

  onLoadMoreEvents(): void {
    // Logic để load thêm sự kiện
    console.log('Loading more events...');
  }

  onEventClick(event: any): void {
    // Logic khi click vào sự kiện
    console.log('Event clicked:', event);
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
      // Thực hiện hành động khi đã đăng nhập
      console.log('Thực hiện hành động...');
      // Thêm logic của bạn ở đây
    } else {
      // Hiển thị thông báo yêu cầu đăng nhập
      this.notification.showNotification(
        'Bạn phải đăng nhập để sử dụng chức năng này.',
        5000
      );
    }
  }

  onNotificationClose() {
    console.log('Notification đã đóng');
  }
}
