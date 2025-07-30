import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { ListEventsService } from '../../services/list-events.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-reviews-event',
  templateUrl: './reviews-event.component.html',
  styleUrl: './reviews-event.component.css',
  imports: [CommonModule, DatePipe]
})
export class ReviewsEventComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  reviews: any[] = [];
  isLoadingEvents = false;
  isLoadingReviews = false;

  constructor(
    private listEventsService: ListEventsService,
    private reviewsService: ReviewsService
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.isLoadingEvents = true;
    this.listEventsService.getEventsByOrganizer().subscribe({
      next: res => {
        console.log('Danh sách sự kiện trả về:', res);
        this.events = res?.data?.listEvents || [];
        this.isLoadingEvents = false;
      },
      error: err => {
        console.error('Lỗi khi lấy danh sách sự kiện:', err);
        this.isLoadingEvents = false;
      }
    });
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
    console.log('Sự kiện được chọn:', event);
    this.fetchReviews(event.id || event.eventId);
  }

  fetchReviews(eventId: number | string) {
    this.isLoadingReviews = true;
    this.reviewsService.getReviewsByEventId(eventId).subscribe({
      next: res => {
        console.log('Kết quả reviews trả về:', res);
        this.reviews = res?.reviewDetails || [];
        this.isLoadingReviews = false;
      },
      error: err => {
        this.isLoadingReviews = false;
        console.error('Lỗi khi lấy đánh giá sự kiện:', err);
      }
    });
  }

  backToList() {
    this.selectedEvent = null;
    this.reviews = [];
  }
}
