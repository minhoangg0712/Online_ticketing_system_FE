import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApprovalRequestComponent } from './approval-request.component';
import { AdminService } from '../service/admin.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('ApprovalRequestComponent', () => {
  let component: ApprovalRequestComponent;
  let fixture: ComponentFixture<ApprovalRequestComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminService', [
      'getEvents',
      'getEventCount',
      'getEventCountByStatus',
      'approveEvent',
      'rejectEvent',
      'revokeApproval',
      'deleteEvent',
      'approveEvents',
      'rejectEvents',
      'deleteEvents',
      'getEventById'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApprovalRequestComponent],
      providers: [{ provide: AdminService, useValue: spy }]
    }).compileComponents();

    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    httpMock = TestBed.inject(HttpTestingController);

    // default mocks
    adminServiceSpy.getEvents.and.returnValue(of({ data: { listEvents: [] } }));
    adminServiceSpy.getEventCount.and.returnValue(of(0));
    adminServiceSpy.getEventCountByStatus.and.returnValue(of(0));

    fixture = TestBed.createComponent(ApprovalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', fakeAsync(() => {
    const mockEvents = [{
      eventId: 1,
      eventName: 'Test Event',
      approvalStatus: 'pending',
      startTime: '2025-01-01T10:00:00',
      endTime: '2025-01-01T12:00:00',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-02',
      address: 'HN',
      category: 'Tech',
      organizerId: 10,
      organizerName: 'Org'
    }];
    adminServiceSpy.getEvents.and.returnValue(of({ data: { listEvents: mockEvents } }));

    component.loadEvents();
    tick();

    expect(component.events.length).toBe(1);
    expect(component.stats.total).toBe(1);
    expect(component.stats.pending).toBe(1);
  }));

  it('should handle error when loading events', fakeAsync(() => {
    adminServiceSpy.getEvents.and.returnValue(throwError(() => new Error('load error')));
    component.loadEvents();
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should filter events by keyword, status and category', () => {
    component.events = [{
      id: 1, title: 'Angular Conf', description: '', startDate: '', endDate: '',
      startTime: '', endTime: '', location: '', category: 'Tech',
      status: 'approved', createdDate: '', organizer: { id: 1, name: 'Alice' }
    } as any];
    component.searchKeyword = 'angular';
    component.selectedStatus = 'approved';
    component.selectedCategory = 'Tech';
    component.applyFilters();
    expect(component.filteredEvents.length).toBe(1);
  });

  it('should approve event successfully', fakeAsync(() => {
    adminServiceSpy.approveEvent.and.returnValue(of({}));
    component.approveEvent(1);
    tick();
    expect(adminServiceSpy.approveEvent).toHaveBeenCalledWith(1);
  }));

  it('should reject event successfully', fakeAsync(() => {
    adminServiceSpy.rejectEvent.and.returnValue(of({}));
    component.rejectEvent(2, 'Reason');
    tick();
    expect(adminServiceSpy.rejectEvent).toHaveBeenCalledWith(2, 'Reason');
  }));

  it('should batch approve events', fakeAsync(() => {
    component.selectedEvents = [1, 2];
    adminServiceSpy.approveEvents.and.returnValue(of({}));
    component.batchApprove();
    tick();
    expect(adminServiceSpy.approveEvents).toHaveBeenCalledWith([1, 2]);
    expect(component.selectedEvents.length).toBe(0);
  }));

  it('should batch reject events', fakeAsync(() => {
    component.selectedEvents = [1];
    component.rejectReason = 'Spam';
    adminServiceSpy.rejectEvents.and.returnValue(of({}));
    component.batchReject();
    tick();
    expect(adminServiceSpy.rejectEvents).toHaveBeenCalledWith([1], 'Spam');
  }));

  it('should batch delete events', fakeAsync(() => {
    component.selectedEvents = [1];
    adminServiceSpy.deleteEvents.and.returnValue(of({}));
    component.batchDelete();
    tick();
    expect(adminServiceSpy.deleteEvents).toHaveBeenCalledWith([1]);
  }));

  it('should view event detail', fakeAsync(() => {
    const apiEvent = {
      eventId: 1, eventName: 'Detail', approvalStatus: 'pending',
      startTime: '2025-01-01T10:00:00', endTime: '2025-01-01T12:00:00',
      createdAt: '2025-01-01', updatedAt: '2025-01-02',
      address: 'HN', category: 'Tech', organizerId: 1, organizerName: 'Alice'
    };
    adminServiceSpy.getEventById.and.returnValue(of({ data: apiEvent }));

    component.viewEventDetail({ id: 1 } as any);
    tick();
    expect(component.selectedEvent?.title).toBe('Detail');
    expect(component.showDetailModal).toBeTrue();
  }));

  it('should export event excel', fakeAsync(() => {
    const mockBlob = new Blob(['excel'], { type: 'application/vnd.ms-excel' });
    component.exportEventExcel(123);
    const req = httpMock.expectOne('http://localhost:8080/api/events/123/report/excel');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob);
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should export event pdf', fakeAsync(() => {
    const mockBlob = new Blob(['pdf'], { type: 'application/pdf' });
    component.exportEventPdf(456);
    const req = httpMock.expectOne('http://localhost:8080/api/events/456/report/pdf');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob);
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should toggle selection and select all', () => {
    component.filteredEvents = [{ id: 1 } as any, { id: 2 } as any];
    component.toggleEventSelection(1);
    expect(component.isEventSelected(1)).toBeTrue();

    component.selectAll = true;
    component.toggleSelectAll();
    expect(component.selectedEvents.length).toBeGreaterThan(0);
  });

  it('should return status class and text', () => {
    expect(component.getStatusClass('pending')).toBe('badge-warning');
    expect(component.getStatusText('approved')).toBe('Đã duyệt');
    expect(component.getStatusIcon('rejected')).toBe('fas fa-times');
  });

  it('should format date and datetime', () => {
    const date = '2025-01-01T10:00:00';
    expect(component.formatDate(date)).toContain('2025');
    expect(component.formatDateTime(date)).toContain('10:00');
  });

  it('should get unique categories', () => {
    component.events = [{ category: 'Tech' } as any, { category: 'Art' } as any, { category: 'Tech' } as any];
    const cats = component.getUniqueCategories();
    expect(cats).toContain('Tech');
    expect(cats).toContain('Art');
  });

  it('should view rejection reason', () => {
    spyOn(component, 'showSuccess');
    spyOn(component, 'showError');
    component.viewRejectionReason({ rejectionReason: 'Invalid' } as any);
    expect(component.showSuccess).toHaveBeenCalled();

    component.viewRejectionReason({ rejectionReason: '' } as any);
    expect(component.showError).toHaveBeenCalled();
  });
});
