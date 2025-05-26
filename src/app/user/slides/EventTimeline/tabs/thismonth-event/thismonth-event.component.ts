import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thismonth-event',
  imports: [CommonModule],
  templateUrl: './thismonth-event.component.html',
  styleUrl: './thismonth-event.component.css'
})
export class ThismonthEventComponent implements OnInit {
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
        imageUrl: '/assets/img1.jpg',
        title: '[FLOWER 1969’s] ROLLERBALL PERFUME WORKSHOP – NƯỚC HOA LĂN',
        price: '279.000đ',
        date: '24 tháng 05, 2025'
      },
      {
        imageUrl: '/assets/img2.jpg',
        title: 'SÂN KHẤU THIÊN LONG – LƯU KIM ĐÍNH – GIỖ TỔ NGÀNH SÂN KHẤU',
        price: '150.000đ',
        date: '27 tháng 09, 2025'
      },
      {
        imageUrl: '/assets/img3.jpg',
        title: 'SKNT TRƯỜNG HÙNG MINH : TRUY LÙNG THÁI TỬ',
        price: '300.000đ',
        date: '24 tháng 05, 2025'
      },
      {
        imageUrl: '/assets/img4.jpg',
        title: '[FLOWER 1969’s] WORKSHOP SOLID PERFUME – NƯỚC HOA KHÔ',
        price: '279.000đ',
        date: '24 tháng 05, 2025'
      },
      {
        imageUrl: '',
        title: 'dfgdfgdfgdgdfgdfgdfg',
        price: '579.000đ',
        date: '28 tháng 05, 2025'
      },
      {
        imageUrl: '/assets/img4.jpg',
        title: '[FLOWER 1969’s] WORKSHOP SOLID PERFUME – NƯỚC HOA KHÔ',
        price: '279.000đ',
        date: '24 tháng 05, 2025'
      },
      {
        imageUrl: '/assets/img4.jpg',
        title: '[FLOWER 1969’s] WORKSHOP SOLID PERFUME – NƯỚC HOA KHÔ',
        price: '279.000đ',
        date: '24 tháng 05, 2025'
      },
      {
        imageUrl: '/assets/img4.jpg',
        title: '[FLOWER 1969’s] WORKSHOP SOLID PERFUME – NƯỚC HOA KHÔ',
        price: '279.000đ',
        date: '24 tháng 05, 2025'
      },
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
