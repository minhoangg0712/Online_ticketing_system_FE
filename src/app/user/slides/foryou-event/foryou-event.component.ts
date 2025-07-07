import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foryou-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foryou-event.component.html',
  styleUrls: ['./foryou-event.component.css']
})
export class ForyouEventComponent implements OnInit {
  events: any[] = [];
  visibleItems: any[] = [];
  startIndex: number = 0;
  readonly ITEMS_PER_PAGE = 4;

  constructor(private eventService: EventsService,private router: Router) {}

  ngOnInit(): void {
    this.loadForYouEvents();
  }

  loadForYouEvents() {
    this.eventService.getRecommendedEvents('foryou').subscribe(res => {
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
      
      this.startIndex = 0;
      this.updateVisibleItems();
    });
  }

  updateVisibleItems() {
    this.visibleItems = this.events.slice(this.startIndex, this.startIndex + this.ITEMS_PER_PAGE);
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
    return this.startIndex + this.ITEMS_PER_PAGE < this.events.length;
  }

  goToEventDetail(eventId: number) {
    this.router.navigate(['/detail-ticket', eventId]);
  }
}
