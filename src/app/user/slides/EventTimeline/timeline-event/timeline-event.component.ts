import { Component } from '@angular/core';
import { ThismonthEventComponent } from '../tabs/thismonth-event/thismonth-event.component';
import { ThisweekendEventComponent } from '../tabs/thisweekend-event/thisweekend-event.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-timeline-event',
  imports: [ThismonthEventComponent,ThisweekendEventComponent, CommonModule],
  templateUrl: './timeline-event.component.html',
  styleUrl: './timeline-event.component.css'
})
export class TimelineEventComponent {
  images: string[] = [
    '/assets/anh.webp'
  ];

  selectedTab: string = 'thisweekend';
  setTab(tab: string) {
    this.selectedTab = tab;
  }

  onSeeMore() {
    // điều hướng hoặc hiển thị thêm nội dung
    console.log('Xem thêm được bấm');
  }

}
