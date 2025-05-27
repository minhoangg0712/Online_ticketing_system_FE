import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livemusic-event',
  imports: [CommonModule],
  templateUrl: './livemusic-event.component.html',
  styleUrl: './livemusic-event.component.css'
})
export class LivemusicEventComponent implements OnInit {
  items: any[] = [];
  visibleItems: any[] = [];
  startIndex: number = 0;
  readonly ITEMS_PER_PAGE = 4;

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.items = [
      {
    imageUrl: '/assets/img_bach_cong_khanh.jpg',
    title: '[BẾN THÀNH] Đêm nhạc Bạch Công Khanh - Chu Thúy Quỳnh',
    price: 'Từ 500.000đ',
    date: '30 tháng 05, 2025'
  },
  {
    imageUrl: '/assets/img_la_vie_en_rose.jpg',
    title: 'LIVESHOW "LA VIE EN ROSE" - Quốc Thiên & Hà Nhi',
    price: 'Từ 800.000đ',
    date: '03 tháng 06, 2025'
  },
  {
    imageUrl: '/assets/img1.jpg',
    title: '(S)TRONG TRỌNG HIẾU - CƯỜNG SEVEN',
    price: 'Từ 975.000đ',
    date: '31 tháng 05, 2025'
  },
  {
    imageUrl: '/assets/img1.jpg',
    title: 'EXID 2025 FANCON IN VIET NAM',
    price: 'Từ 1.500.000đ',
    date: '31 tháng 05, 2025'
  },
    ];
    this.updateVisibleItems();
  }

  updateVisibleItems() {
    this.visibleItems = this.items.slice(this.startIndex, this.startIndex + this.ITEMS_PER_PAGE);
  }

  onSeeMore() {
    // điều hướng hoặc hiển thị thêm nội dung
    console.log('Xem thêm được bấm');
  }
}
