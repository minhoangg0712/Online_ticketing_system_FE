import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-livemusic-event',
  imports: [CommonModule],
  templateUrl: './livemusic-event.component.html',
  styleUrl: './livemusic-event.component.css'
})
export class LivemusicEventComponent implements OnInit {
  events: any[] = [];
  visibleItems: any[] = [];
  startIndex: number = 0;
  readonly ITEMS_PER_PAGE = 4;

  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.loadLiveMusicEvents();
  }

  loadLiveMusicEvents() {
    this.eventService.getRecommendedEvents('livemusic').subscribe(res => {
      this.events = res?.data?.listEvents || [];
      
      this.events = this.events.map((event: any) => ({
        id: event.id,
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

  onSeeMore() {
    // điều hướng hoặc hiển thị thêm nội dung
    console.log('Xem thêm được bấm');
  }
}
