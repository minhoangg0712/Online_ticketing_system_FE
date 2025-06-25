import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  imports: [ CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  tickets: any[] = [];
  selectedTab: string = 'all';

  setTab(tab: string) {
    this.selectedTab = tab;
    this.onTabChange(tab);
  }
  constructor() { }
  ngOnInit(): void {
    this.tickets = [
      {
        id: 1,
        eventName: 'Live Concert Sơn Tùng M-TP',
        eventDate: '2025-07-20 20:00',
        seatInfo: 'Ghế D10, Khu VIP',
        location: 'SVĐ Mỹ Đình',
        price: '1.500.000đ',
        type: 'Vé điện tử',
        status: 'Thành công'
      },
      {
        id: 2,
        eventName: 'Nhạc kịch Broadway - Phantom of the Opera',
        eventDate: '2025-08-15 19:30',
        seatInfo: 'Ghế E3, Khu Balcony',
        location: 'Nhà hát TP.HCM',
        price: '1.000.000đ',
        type: 'Vé vật lý',
        status: 'Thành công'
      },
      {
        id: 3,
        eventName: 'Gala Hài Kịch 2025',
        eventDate: '2025-09-01 18:00',
        seatInfo: 'Ghế F6, Khu Standard',
        location: 'Sân khấu Trống Đồng',
        price: '450.000đ',
        type: 'Vé điện tử',
        status: 'Thất bại'
      }
    ];
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
}
