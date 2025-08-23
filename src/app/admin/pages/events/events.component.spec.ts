import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EventsComponent } from './events.component';
import { AdminService } from '../service/admin.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Mock data for testing
const mockEventsResponse = {
  data: {
    listEvents: [
      { id: 1, name: 'Completed Event 1', status: 'completed', startTime: '2023-01-01T10:00:00Z' },
      { id: 2, name: 'Approved Event', status: 'approved', startTime: '2023-02-01T10:00:00Z' },
      { id: 3, name: 'Completed Event 2', status: 'completed', startTime: '2023-03-01T10:00:00Z', address: '123 Main St' },
      { id: 4, name: 'Completed Event 3', status: 'completed', startTime: null, endTime: null, updateAt: null },
    ],
  },
};

const mockReviews = [
  { id: 101, comment: 'Great event!', rating: 5 },
  { id: 102, comment: 'Could be better.', rating: 3 },
];

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    // Create spy objects for dependencies
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getEvents', 'getReviewsByEventId', 'deleteReview']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        EventsComponent // Import the standalone component
      ],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    // Get the ChangeDetectorRef instance from the component's injector
    cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Testing ngOnInit and loadCompletedEvents ---
  describe('ngOnInit and loadCompletedEvents', () => {
    it('should load, filter, and format completed events on init', fakeAsync(() => {
      adminServiceSpy.getEvents.and.returnValue(of(mockEventsResponse));

      fixture.detectChanges(); // Triggers ngOnInit
      tick(); // Complete the async observable

      expect(component.isLoading).toBe(false);
      expect(component.completedEvents.length).toBe(3);
      expect(component.completedEvents[0].name).toBe('Completed Event 1');
      expect(component.completedEvents[1].address).toBe('123 Main St');
      // Check date formatting
      expect(component.completedEvents[0].startTime).toBe(new Date('2023-01-01T10:00:00Z').toLocaleString('vi-VN'));
      // Check null/undefined property handling
      expect(component.completedEvents[2].startTime).toBe('Không xác định');
      expect(adminServiceSpy.getEvents).toHaveBeenCalledTimes(1);
    }));

    it('should handle API error when loading events', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      adminServiceSpy.getEvents.and.returnValue(throwError(() => errorResponse));

      fixture.detectChanges();
      tick();

      expect(component.isLoading).toBe(false);
      expect(component.completedEvents.length).toBe(0);
      expect(component.showErrorModal).toBe(true);
      expect(component.modalMessage).toContain('tải danh sách sự kiện');
    }));

     it('should handle empty list of events from API', fakeAsync(() => {
      adminServiceSpy.getEvents.and.returnValue(of({ data: { listEvents: [] } }));

      fixture.detectChanges();
      tick();

      expect(component.isLoading).toBe(false);
      expect(component.completedEvents.length).toBe(0);
    }));
  });

  // --- Testing viewReviews ---
  describe('viewReviews', () => {
    it('should load reviews for a selected event', fakeAsync(() => {
      adminServiceSpy.getReviewsByEventId.and.returnValue(of(mockReviews));
      const eventId = 1;
      const eventName = 'Completed Event 1';

      component.viewReviews(eventId, eventName);
      tick();

      expect(component.showReviewsModal).toBe(true);
      expect(component.isLoadingReviews).toBe(false);
      expect(component.selectedEventId).toBe(eventId);
      expect(component.selectedEventName).toBe(eventName);
      expect(component.selectedEventReviews).toEqual(mockReviews);
      expect(adminServiceSpy.getReviewsByEventId).toHaveBeenCalledWith(eventId);
    }));

    it('should handle "No reviews found" (404) error gracefully', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        status: 404,
        error: { message: 'No reviews found for this event' }
      });
      adminServiceSpy.getReviewsByEventId.and.returnValue(throwError(() => errorResponse));

      component.viewReviews(1, 'Test Event');
      tick();

      expect(component.isLoadingReviews).toBe(false);
      expect(component.selectedEventReviews.length).toBe(0);
      expect(component.showErrorModal).toBe(false); // Should not show general error modal
    }));

    it('should handle general API error when loading reviews', fakeAsync(() => {
       const errorResponse = new HttpErrorResponse({ status: 500 });
       adminServiceSpy.getReviewsByEventId.and.returnValue(throwError(() => errorResponse));

       component.viewReviews(1, 'Test Event');
       tick();

       expect(component.isLoadingReviews).toBe(false);
       expect(component.showReviewsModal).toBe(false); // Modal should be hidden
       expect(component.showErrorModal).toBe(true);
       expect(component.modalMessage).toContain('tải danh sách đánh giá');
    }));

    it('should show an error if event ID is invalid', () => {
        component.viewReviews(null as any, 'Invalid Event');
        expect(component.showErrorModal).toBe(true);
        expect(component.modalMessage).toContain('ID sự kiện không hợp lệ');
        expect(adminServiceSpy.getReviewsByEventId).not.toHaveBeenCalled();
    });
  });

  // --- Testing deleteReview ---
  describe('deleteReview', () => {
    const eventId = 1;
    const reviewIdToDelete = 101;

    beforeEach(() => {
      // Set up initial state as if reviews are being viewed
      component.selectedEventId = eventId;
      component.selectedEventReviews = [...mockReviews];
    });

    it('should delete a review and reload the list', fakeAsync(() => {
      const reviewsAfterDelete = mockReviews.filter(r => r.id !== reviewIdToDelete);
      adminServiceSpy.deleteReview.withArgs(reviewIdToDelete).and.returnValue(of(undefined));
      adminServiceSpy.getReviewsByEventId.withArgs(eventId).and.returnValue(of(reviewsAfterDelete));

      component.deleteReview(reviewIdToDelete);
      tick();

      expect(adminServiceSpy.deleteReview).toHaveBeenCalledWith(reviewIdToDelete);
      expect(adminServiceSpy.getReviewsByEventId).toHaveBeenCalledWith(eventId);
      expect(component.selectedEventReviews).toEqual(reviewsAfterDelete);
      expect(component.isLoadingReviews).toBe(false);
    }));

    it('should handle error during review deletion', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({ status: 500 });
      adminServiceSpy.deleteReview.and.returnValue(throwError(() => errorResponse));

      component.deleteReview(reviewIdToDelete);
      tick();

      expect(component.isLoadingReviews).toBe(false);
      expect(component.showErrorModal).toBe(true);
      expect(component.modalMessage).toContain('xóa đánh giá');
    }));

    it('should handle "No reviews found" on reload after deleting the last review', fakeAsync(() => {
        adminServiceSpy.deleteReview.withArgs(reviewIdToDelete).and.returnValue(of(undefined));
        const errorResponse = new HttpErrorResponse({ status: 404, error: { message: 'No reviews found' } });
        adminServiceSpy.getReviewsByEventId.withArgs(eventId).and.returnValue(throwError(() => errorResponse));

        component.deleteReview(reviewIdToDelete);
        tick();

        expect(component.selectedEventReviews.length).toBe(0);
        expect(component.isLoadingReviews).toBe(false);
        expect(component.showErrorModal).toBe(false);
    }));
  });

  // --- Testing Modal Controls ---
  describe('Modal Controls', () => {
    it('should reset state when closing the reviews modal', () => {
      component.showReviewsModal = true;
      component.selectedEventId = 1;
      component.selectedEventName = 'Test';
      component.selectedEventReviews = mockReviews;

      component.closeReviewsModal();

      expect(component.showReviewsModal).toBe(false);
      expect(component.selectedEventId).toBeNull();
      expect(component.selectedEventName).toBeNull();
      expect(component.selectedEventReviews.length).toBe(0);
    });

    it('should reset state when closing the error modal', () => {
      component.showErrorModal = true;
      component.modalMessage = 'Error!';

      component.closeErrorModal();

      expect(component.showErrorModal).toBe(false);
      expect(component.modalMessage).toBe('');
    });
  });

  // --- Testing Utility Methods ---
  describe('Utility Methods', () => {
    it('getSafeImageUrl should call sanitizer', () => {
      const unsafeUrl = 'http://example.com/image.png';
      const safeUrl: SafeUrl = 'safe-url';
      sanitizerSpy.bypassSecurityTrustUrl.and.returnValue(safeUrl);

      const result = component.getSafeImageUrl(unsafeUrl);

      expect(result).toBe(safeUrl);
      expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith(unsafeUrl);
    });

     it('getSafeImageUrl should return null for null input', () => {
        expect(component.getSafeImageUrl(null)).toBeNull();
     });

    it('handleImageError should set a default src', () => {
      // Create a mock image element
      const mockImgElement = document.createElement('img');
      mockImgElement.src = 'http://broken-link.com/img.png';
      // Create a mock event object
      const mockEvent = { target: mockImgElement } as unknown as Event;

      component.handleImageError(mockEvent);

      expect(mockImgElement.src).toContain('assets/default-profile-picture.png');
    });
  });
});
