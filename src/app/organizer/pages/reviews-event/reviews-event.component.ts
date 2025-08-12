import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { ListEventsService } from '../../services/list-events.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastNotificationComponent } from '../../../user/pop-up/toast-notification/toast-notification.component';

@Component({
  selector: 'app-reviews-event',
  templateUrl: './reviews-event.component.html',
  styleUrl: './reviews-event.component.css',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ToastNotificationComponent]
})
export class ReviewsEventComponent implements OnInit {
  @ViewChild('notification') notification!: ToastNotificationComponent;

  shownotification: boolean = false;

  events: any[] = [];
  filteredEvents: any[] = [];
  selectedEvent: any = null;
  reviews: any[] = [];
  isLoadingEvents = false;
  isLoadingReviews = false;
  searchTerm: string = '';
  selectedStar: number | null = null;
  showFilter = false;

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pagedEvents: any[] = [];

  constructor(
    private listEventsService: ListEventsService,
    private reviewsService: ReviewsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.filteredEvents = [...this.events];
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  fetchEvents() {
    this.isLoadingEvents = true;
    this.listEventsService.getEventsByOrganizer().subscribe({
      next: res => {
        this.events = res?.data?.listEvents || [];
        this.isLoadingEvents = false;

        this.filteredEvents = [...this.events];
        this.updatePagedEvents();

        this.events.forEach(event => {
          const eventId = event.id || event.eventId;
          if (eventId && event.status === 'completed') {
            this.reviewsService.getReviewsByEventId(eventId).subscribe({
              next: reviewRes => {
                event.reviewDetails = reviewRes?.data?.reviewDetails || [];
                this.filteredEvents = [...this.filteredEvents];
                this.cd.detectChanges();
              },
              error: () => {
                event.reviewDetails = [];
                this.filteredEvents = [...this.filteredEvents];
                this.cd.detectChanges();
              }
            });
          } else {
            event.reviewDetails = [];
          }
        });
      },
      error: () => {
        this.isLoadingEvents = false;
      }
    });
  }

  updatePagedEvents(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedEvents = this.filteredEvents.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
  }

  selectEvent(event: any) {
    if (event.status !== 'completed') {
      this.notification.showNotification('Không thể xem đánh giá khi sự kiện chưa kết thúc!', 5000, 'warning');
      return;
    }
    this.selectedEvent = event;
    this.fetchReviews(event.id || event.eventId);
  }

  fetchReviews(eventId: number | string) {
    this.isLoadingReviews = true;
    this.reviewsService.getReviewsByEventId(eventId).subscribe({
      next: res => {
        this.reviews = res?.data?.reviewDetails || [];
        this.isLoadingReviews = false;
      },
      error: () => {
        this.isLoadingReviews = false;
      }
    });
  }

  getAverageRating(reviewsArr?: any[]): number | null {
    const arr = Array.isArray(reviewsArr) ? reviewsArr : this.reviews;
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const sum = arr.reduce((acc: number, r: any) => acc + (typeof r.rating === 'number' ? r.rating : 0), 0);
    const avg = Math.round((sum / arr.length) * 10) / 10;
    return avg;
  }

  backToList() {
    this.selectedEvent = null;
    this.reviews = [];
  }

  trackByEventId(index: number, event: any): number {
    return event.id || event.eventId;
  }

  onSearchChange(): void {
    let filtered = [...this.events];
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(event => {
        const nameMatch = event.eventName && event.eventName.toLowerCase().includes(searchLower);
        const venueMatch = event.addressName && event.addressName.toLowerCase().includes(searchLower);
        const categoryMatch = event.category && event.category.toLowerCase().includes(searchLower);
        const descriptionMatch = event.description && event.description.toLowerCase().includes(searchLower);
        return nameMatch || venueMatch || categoryMatch || descriptionMatch;
      });
    }
    if (this.selectedStar) {
      filtered = filtered.filter(event => {
        if (!event.reviewDetails || event.reviewDetails.length === 0) return false;
        const avg = this.getAverageRating(event.reviewDetails);
        return avg !== null && Math.floor(avg) === this.selectedStar;
      });
    }
    this.filteredEvents = filtered;
    this.currentPage = 1;
    this.updatePagedEvents();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEvents = [...this.events];
    this.currentPage = 1;
    this.updatePagedEvents();
  }

  onStarFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStar = value ? Number(value) : null;
    this.onSearchChange();
  }

  onNotificationClose() {}
}
