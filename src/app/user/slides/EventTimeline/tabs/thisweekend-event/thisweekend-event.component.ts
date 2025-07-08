import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../../services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thisweekend-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thisweekend-event.component.html',
  styleUrls: ['./thisweekend-event.component.css']
})
export class ThisweekendEventComponent implements OnInit {
  items: any[] = [];
  visibleItems: any[] = [];
  startIndex = 0;
  readonly ITEMS_PER_PAGE = 4;

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.loadWeekendEventsThisWeek();
  }

  loadWeekendEventsThisWeek() {
    const { startTimeISO, endTimeISO, startDate, endDate } = this.getVietnamWeekTimeRange();

    this.eventsService.getRecommendedEvents(
      '', // category
      undefined,
      startTimeISO,
      endTimeISO
    ).subscribe(res => {
      const allEvents = res?.data?.listEvents || [];

      // Lọc lại ở frontend để chắc chắn đúng mốc thời gian
      const filteredEvents = allEvents.filter((event: any) => {
        // Giả định event.startTime là '2025-07-12 08:00:00' không có Z
        const raw = event.startTime.replace(' ', 'T') + '+07:00'; // ép format
        const eventTime = new Date(raw).getTime(); // dùng đúng timezone

        return eventTime >= startDate.getTime() && eventTime <= endDate.getTime();
        });


      this.items = filteredEvents.map((event: any) => ({
        id: event.eventId,
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

  // ✅ Lấy khung giờ từ 00:00 hôm nay đến hết Chủ nhật theo giờ Việt Nam (UTC+7)
  getVietnamWeekTimeRange(): { startTimeISO: string, endTimeISO: string, startDate: Date, endDate: Date } {
    const now = new Date();

    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0); // 00:00 hôm nay

    const dayOfWeek = startDate.getDay(); // 0 (CN) -> 6 (T7)

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (7 - dayOfWeek));
    endDate.setHours(23, 59, 59, 999); // Cuối CN

    const startTimeISO = this.toISOWithTimezoneOffset(startDate, 7);
    const endTimeISO = this.toISOWithTimezoneOffset(endDate, 7);

    console.log('VN Today ISO:', startTimeISO);
    console.log('VN EndOfWeek ISO:', endTimeISO);

    return { startTimeISO, endTimeISO, startDate, endDate };
  }

  // ✅ Chuyển Date thành ISO string với timezone offset (ví dụ: +07:00 cho VN)
  toISOWithTimezoneOffset(date: Date, offsetHours: number): string {
    const offsetDate = new Date(date.getTime() - offsetHours * 60 * 60 * 1000);
    return offsetDate.toISOString().replace('Z', `+${offsetHours.toString().padStart(2, '0')}:00`);
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

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  }

  goToEventDetail(eventId: number) {
    this.router.navigate(['/detail-ticket', eventId]);
  }
}
