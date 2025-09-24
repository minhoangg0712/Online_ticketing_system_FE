import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from '../service/admin.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

interface Event {
  eventId: number;
  eventName: string;
  status: string;
  address: string;
  approvalStatus: string;
  startTime: string;
  endTime: string;
  updateAt: string;
  organizerName: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  completedEvents: Event[] = [];
  selectedEventReviews: any[] = [];
  selectedEventId: number | null = null;
  selectedEventName: string | null = null;
  isLoading: boolean = true;
  isLoadingReviews: boolean = false;
  showReviewsModal: boolean = false;
  modalMessage: string = '';
  showErrorModal: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

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
    const params = {
      page: this.currentPage,
      size: this.itemsPerPage
    };

    this.adminService.getCompletedEvents(params).subscribe({
      next: (response) => {
        console.log('Raw API response for completed events (EventsComponent):', JSON.stringify(response, null, 2));
        if (response && response.data && response.data.listEvents) {
          this.completedEvents = response.data.listEvents.map((event: any) => ({
            eventId: event.eventId,
            eventName: event.eventName,
            status: event.status,
            address: event.address || 'Không có',
            approvalStatus: event.approvalStatus,
            startTime: event.startTime ? new Date(event.startTime).toLocaleString('vi-VN') : 'Không xác định',
            endTime: event.endTime ? new Date(event.endTime).toLocaleString('vi-VN') : 'Không xác định',
            updateAt: event.updateAt ? new Date(event.updateAt).toLocaleString('vi-VN') : 'Không xác định',
            organizerName: event.organizerName || 'Không xác định'
          }));
          this.totalItems = response.data.totalElements || response.data.listEvents.length || 0;
          this.currentPage = response.data.pageNo || 1;
          this.itemsPerPage = response.data.pageSize || 10;
          this.totalPages = response.data.totalPages || 1;
          console.log('Mapped completedEvents:', JSON.stringify(this.completedEvents, null, 2));
          console.log('totalItems:', this.totalItems, 'totalPages:', this.totalPages);
          console.log('completedEvents length before render:', this.completedEvents.length);
        } else {
          this.completedEvents = [];
          this.totalItems = 0;
          this.currentPage = 1;
          this.itemsPerPage = 10;
          this.totalPages = 1;
          console.log('No completed events found in response');
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading completed events:', error);
        this.modalMessage = 'Có lỗi xảy ra khi tải danh sách sự kiện. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.completedEvents = [];
        this.totalItems = 0;
        this.totalPages = 1;
        this.isLoading = false;
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading reviews:', error);
        if (error.status === 404 && error.error?.message?.includes('No reviews found')) {
          this.selectedEventReviews = [];
          this.isLoadingReviews = false;
          this.cdr.markForCheck();
        } else {
          this.modalMessage = 'Có lỗi xảy ra khi tải danh sách đánh giá. Vui lòng thử lại!';
          this.showReviewsModal = false;
          this.showErrorModal = true;
          this.selectedEventReviews = [];
          this.isLoadingReviews = false;
          this.cdr.markForCheck();
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
    const eventId: number = this.selectedEventId;
    this.isLoadingReviews = true;
    this.adminService.deleteReview(reviewId).subscribe({
      next: () => {
        console.log(`Review ${reviewId} deleted successfully`);
        this.adminService.getReviewsByEventId(eventId).subscribe({
          next: (reviews) => {
            this.selectedEventReviews = reviews;
            this.isLoadingReviews = false;
            this.cdr.markForCheck();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error reloading reviews after delete:', error);
            if (error.status === 404 && error.error?.message?.includes('No reviews found')) {
              this.selectedEventReviews = [];
              this.isLoadingReviews = false;
              this.cdr.markForCheck();
            } else {
              this.modalMessage = 'Có lỗi xảy ra khi tải lại danh sách đánh giá. Vui lòng thử lại!';
              this.showErrorModal = true;
              this.isLoadingReviews = false;
              this.cdr.markForCheck();
            }
          }
        });
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.modalMessage = 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.isLoadingReviews = false;
        this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.modalMessage = '';
    this.cdr.markForCheck();
  }

  getSafeImageUrl(url: string | null | undefined): SafeUrl | null {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return null;
  }

  handleImageError(event: ErrorEvent): void {
    console.log('Image load error:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/default-profile-picture.png';
  }

  getTotalPages(): number {
    return this.totalPages; // Dùng totalPages từ API thay vì tính lại
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages() && page !== this.currentPage) {
      this.currentPage = page;
      this.loadCompletedEvents();
    }
  }

  getDisplayEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.totalItems);
  }
}
