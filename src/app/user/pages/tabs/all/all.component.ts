import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all',
  imports: [ CommonModule],
  templateUrl: './all.component.html',
  styleUrl: './all.component.css'
})
export class AllComponent {
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
        eventName: 'Liveshow Mỹ Tâm',
        eventDate: '2025-06-30 20:00',
        seatInfo: 'Ghế A12, Khu VIP',
        location: 'Nhà hát Hòa Bình',
        price: '1.200.000đ',
        type: 'Vé điện tử',
        status: 'Thành công'
      },
      {
        id: 2,
        eventName: 'Chung kết Rap Việt',
        eventDate: '2025-07-05 19:00',
        seatInfo: 'Ghế B5, Khu Standard',
        location: 'Sân khấu Lan Anh',
        price: '750.000đ',
        type: 'Vé vật lý',
        status: 'Thành công'
      },
      {
        id: 3,
        eventName: 'Hòa nhạc Sơn Tùng',
        eventDate: '2025-08-10 18:30',
        seatInfo: 'Ghế C1, Khu Premium',
        location: 'Nhà hát lớn Hà Nội',
        price: '980.000đ',
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
