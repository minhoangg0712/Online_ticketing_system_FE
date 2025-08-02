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
        this.events = res?.data?.listEvents || [];
        this.isLoadingEvents = false;

        this.events.forEach(event => {
          const eventId = event.id || event.eventId;
          if (eventId && event.status === 'completed') {
            this.reviewsService.getReviewsByEventId(eventId).subscribe({
              next: reviewRes => {
                event.reviewDetails = reviewRes?.reviewDetails || [];
              },
              error: err => {
                event.reviewDetails = [];
              }
            });
          } else {
            event.reviewDetails = [];
          }
        });
      },
      error: err => {
        console.error('Lỗi khi lấy danh sách sự kiện:', err);
        this.isLoadingEvents = false;
      }
    });
  }

  selectEvent(event: any) {
    if (event.status !== 'completed') {
      return;
    }
    this.selectedEvent = event;
    this.fetchReviews(event.id || event.eventId);
  }

  fetchReviews(eventId: number | string) {
    this.isLoadingReviews = true;
    this.reviewsService.getReviewsByEventId(eventId).subscribe({
      next: res => {
        this.reviews = res?.reviewDetails || [];
        this.isLoadingReviews = false;
      },
      error: err => {
        this.isLoadingReviews = false;
      }
    });
  }

  getAverageRating(reviewsArr?: any[]): number | null {
    const arr = Array.isArray(reviewsArr) ? reviewsArr : this.reviews;
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const sum = arr.reduce((acc: number, r: any) => acc + (typeof r.rating === 'number' ? r.rating : 0), 0);
    return Math.round((sum / arr.length) * 100) / 100;
  }

  backToList() {
    this.selectedEvent = null;
    this.reviews = [];
  }

  trackByEventId(index: number, event: any): number {
    return event.id || event.eventId;
  }
}
