import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../../services/events.service';

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

  constructor(private eventsService: EventsService){}

  ngOnInit(): void {
    this.loadEventsThisMonth();
  }

  loadEventsThisMonth() {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    this.eventsService.getRecommendedEvents(
      '',               // category (rỗng hoặc truyền tên nếu muốn)
      undefined,        // address
      startOfMonth,
      endOfMonth
    ).subscribe(res => {
      const events = res?.data?.listEvents || [];

      this.items = events.map((event: any) => ({
        imageUrl: event.backgroundUrl || '/assets/default.jpg',
        title: event.eventName,
        price: event.minPrice,
        date: this.formatDate(event.startTime)
      }));

      this.startIndex = 0;
      this.updateVisibleItems();
    });
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
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
