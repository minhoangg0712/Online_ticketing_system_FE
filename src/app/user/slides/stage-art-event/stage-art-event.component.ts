import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-stage-art-event',
  imports: [CommonModule],
  templateUrl: './stage-art-event.component.html',
  styleUrl: './stage-art-event.component.css'
})
export class StageArtEventComponent implements OnInit {
  events: any[] = [];
  visibleItems: any[] = [];
  startIndex: number = 0;
  readonly ITEMS_PER_PAGE = 4;

  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.loadStageArtEvents();
  }

  loadStageArtEvents() {
    this.eventService.getRecommendedEvents('stage-art').subscribe(res => {
      this.events = res?.data?.listEvents || [];
      

      // Map lại nếu cần, đảm bảo có đủ các trường
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
