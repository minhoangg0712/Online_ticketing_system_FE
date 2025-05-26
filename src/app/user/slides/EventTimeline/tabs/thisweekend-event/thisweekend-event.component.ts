import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thisweekend-event',
  imports: [CommonModule],
  templateUrl: './thisweekend-event.component.html',
  styleUrl: './thisweekend-event.component.css'
})
export class ThisweekendEventComponent implements OnInit {
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
    imageUrl: '/assets/concert1.jpg',
    title: 'ĐÊM NHẠC TRỊNH CÔNG SƠN – HOÀI NIỆM VÀ YÊU THƯƠNG',
    price: '450.000đ',
    date: '15 tháng 06, 2025'
  },
  {
    imageUrl: '/assets/exhibition1.jpg',
    title: 'TRIỂN LÃM NGHỆ THUẬT ĐƯƠNG ĐẠI – “SẮC MÀU THỜI GIAN”',
    price: 'Miễn phí',
    date: '12 tháng 07, 2025'
  },
  {
    imageUrl: '/assets/workshop1.jpg',
    title: 'WORKSHOP VẼ MÀU NƯỚC – “THẢ HỒN VÀO PHONG CẢNH”',
    price: '320.000đ',
    date: '22 tháng 06, 2025'
  },
  {
    imageUrl: '/assets/theater1.jpg',
    title: 'KỊCH NÓI “MẸ ƠI! CON NHỚ” – NHÀ HÁT TUỔI TRẺ',
    price: '200.000đ',
    date: '29 tháng 06, 2025'
  },
  {
    imageUrl: '/assets/dance1.jpg',
    title: 'ĐÊM NHẢY ĐƯỜNG PHỐ – HIPHOP VÀ VĂN HOÁ URBAN',
    price: '100.000đ',
    date: '05 tháng 07, 2025'
  },
  {
    imageUrl: '/assets/talk1.jpg',
    title: 'TALKSHOW: “KHỞI NGHIỆP SÁNG TẠO – TỪ ĐAM MÊ ĐẾN HIỆN THỰC”',
    price: 'Miễn phí',
    date: '10 tháng 07, 2025'
  },
  {
    imageUrl: '/assets/film1.jpg',
    title: 'CHIẾU PHIM NGOÀI TRỜI: “KÝ ỨC MÙA HÈ”',
    price: '80.000đ',
    date: '17 tháng 06, 2025'
  },
  {
    imageUrl: '/assets/charity1.jpg',
    title: 'ĐÊM NHẠC TỪ THIỆN – “TRAO YÊU THƯƠNG”',
    price: 'Tuỳ tâm',
    date: '20 tháng 07, 2025'
  }
    ];
    this.updateVisibleItems();
  }

  updateVisibleItems() {
    this.visibleItems = this.items.slice(this.startIndex, this.startIndex + this.ITEMS_PER_PAGE);
  }

  scrollLeft() {
    if (this.canScrollLeft) {
      this.startIndex -= this.ITEMS_PER_PAGE;
      this.updateVisibleItems();
    }
  }

  scrollRight() {
    if (this.canScrollRight) {
      this.startIndex += this.ITEMS_PER_PAGE;
      this.updateVisibleItems();
    }
  }

  get canScrollLeft(): boolean {
    return this.startIndex > 0;
  }

  get canScrollRight(): boolean {
    return this.startIndex + this.ITEMS_PER_PAGE < this.items.length;
  }
}
