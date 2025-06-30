import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../../services/events.service';

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

  constructor(private eventsService: EventsService){}

  ngOnInit(): void {
    this.loadWeekendEventsThisWeek();
  }

  loadWeekendEventsThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const saturday = new Date(today);
    saturday.setDate(today.getDate() + (6 - dayOfWeek));
    saturday.setHours(0, 0, 0, 0);

    const sunday = new Date(today);
    sunday.setDate(today.getDate() + (7 - dayOfWeek));
    sunday.setHours(23, 59, 59, 999);

    this.eventsService.getRecommendedEvents(
      '',
      undefined,
      saturday,
      sunday
    ).subscribe(res => {
      const events = res?.data?.listEvents || [];

      this.items = events.map((event: any) => ({
        backgroundUrl: event.backgroundUrl,
        startTime: event.startTime,
        eventName: event.eventName,
        price: event.minPrice,
        date: this.formatDate(event.startTime)
      }));

      this.startIndex = 0;
      this.updateVisibleItems();
    });
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day} tháng ${month < 10 ? '0' + month : month}, ${year}`;
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
