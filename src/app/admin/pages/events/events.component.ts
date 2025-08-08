
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from '../service/admin.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  completedEvents: any[] = [];
  selectedEventReviews: any[] = [];
  selectedEventId: number | null = null;
  selectedEventName: string | null = null;
  isLoading: boolean = true;
  isLoadingReviews: boolean = false;
  showReviewsModal: boolean = false;
  modalMessage: string = '';
  showErrorModal: boolean = false;

  constructor(
    private adminService: AdminService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompletedEvents();
  }

  loadCompletedEvents(): void {
    this.isLoading = true;
    this.adminService.getEvents().subscribe({
      next: (response) => {
        console.log('All events response:', JSON.stringify(response, null, 2));
        this.completedEvents = (response.data?.listEvents ?? [])
          .filter((event: any) => event.status === 'completed')
          .map((event: any) => ({
            ...event,
            address: event.address || 'Không có',
            startTime: event.startTime ? new Date(event.startTime).toLocaleString('vi-VN') : 'Không xác định',
            endTime: event.endTime ? new Date(event.endTime).toLocaleString('vi-VN') : 'Không xác định',
            updateAt: event.updateAt ? new Date(event.updateAt).toLocaleString('vi-VN') : 'Không xác định'
          }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.modalMessage = 'Có lỗi xảy ra khi tải danh sách sự kiện. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.completedEvents = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewReviews(eventId: number, eventName: string): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.modalMessage = 'Không thể tải đánh giá: ID sự kiện không hợp lệ';
      this.showErrorModal = true;
      return;
    }
    this.selectedEventId = eventId;
    this.selectedEventName = eventName;
    this.isLoadingReviews = true;
    this.showReviewsModal = true;
    this.adminService.getReviewsByEventId(eventId).subscribe({
      next: (reviews) => {
        console.log('Reviews response:', JSON.stringify(reviews, null, 2));
        this.selectedEventReviews = reviews;
        this.isLoadingReviews = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading reviews:', error);
        if (error.status === 404 && error.error?.message?.includes('No reviews found')) {
          this.selectedEventReviews = [];
          this.isLoadingReviews = false;
          this.cdr.detectChanges();
        } else {
          this.modalMessage = 'Có lỗi xảy ra khi tải danh sách đánh giá. Vui lòng thử lại!';
          this.showReviewsModal = false;
          this.showErrorModal = true;
          this.selectedEventReviews = [];
          this.isLoadingReviews = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (!reviewId || this.selectedEventId === null) {
      console.error('Review ID or Event ID is undefined');
      this.modalMessage = 'Không thể xóa đánh giá: ID không hợp lệ';
      this.showErrorModal = true;
      return;
    }
    const eventId: number = this.selectedEventId; // Type assertion để đảm bảo eventId là number
    this.isLoadingReviews = true;
    this.adminService.deleteReview(reviewId).subscribe({
      next: () => {
        console.log(`Review ${reviewId} deleted successfully`);
        this.adminService.getReviewsByEventId(eventId).subscribe({
          next: (reviews) => {
            this.selectedEventReviews = reviews;
            this.isLoadingReviews = false;
            this.cdr.detectChanges();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error reloading reviews after delete:', error);
            if (error.status === 404 && error.error?.message?.includes('No reviews found')) {
              this.selectedEventReviews = [];
              this.isLoadingReviews = false;
              this.cdr.detectChanges();
            } else {
              this.modalMessage = 'Có lỗi xảy ra khi tải lại danh sách đánh giá. Vui lòng thử lại!';
              this.showErrorModal = true;
              this.isLoadingReviews = false;
              this.cdr.detectChanges();
            }
          }
        });
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.modalMessage = 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.isLoadingReviews = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeReviewsModal(): void {
    this.showReviewsModal = false;
    this.selectedEventReviews = [];
    this.selectedEventId = null;
    this.selectedEventName = null;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.cdr.detectChanges();
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.modalMessage = '';
    this.cdr.detectChanges();
  }

  getSafeImageUrl(url: string | null | undefined): SafeUrl | null {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return null;
  }

  handleImageError(event: Event): void {
    console.log('Lỗi tải ảnh:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/default-profile-picture.png';
  }
}

