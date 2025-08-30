import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateEventComponent } from './create-event.component';
import { CreateEventsService } from '../../services/create-events.service';
import { LocationService } from '../../services/location.service';
import { ToastNotificationComponent } from '../../../user/pop-up/toast-notification/toast-notification.component';

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;
  let mockCreateEventService: jasmine.SpyObj<CreateEventsService>;
  let mockLocationService: jasmine.SpyObj<LocationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCreateEventService = jasmine.createSpyObj('CreateEventsService', ['createEvent']);
    mockLocationService = jasmine.createSpyObj('LocationService', ['getProvinces', 'getDistricts', 'getWards']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, ToastNotificationComponent, CreateEventComponent],
      providers: [
        { provide: CreateEventsService, useValue: mockCreateEventService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;

    // Mock default provinces
    mockLocationService.getProvinces.and.returnValue(of([{ id: 1, name: 'Hà Nội' }]));
    mockLocationService.getDistricts.and.returnValue(of([{ id: 10, name: 'Ba Đình' }]));
    mockLocationService.getWards.and.returnValue(of([{ id: 100, name: 'Phúc Xá' }]));

    fixture.detectChanges();
  });

  function setupValidForm() {
    component.eventForm.patchValue({
      eventName: 'Test Event',
      venueName: 'Venue',
      province: 1,
      category: 'Music',
    });

    component.ticketForm.patchValue({
      startDate: '2025-01-01',
      startTime: '10:00',
      endDate: '2025-01-02',
      endTime: '12:00',
      eventDate: '2025-01-05',
      eventTime: '09:00',
      eventEndDate: '2025-01-05',
      eventEndTime: '12:00',
    });

    component.tickets.at(0).patchValue({
      name: 'VIP',
      price: 100000,
      quantity: 10
    });

    component.eventLogoFile = new File([''], 'logo.png', { type: 'image/png' });
    component.eventBackgroundFile = new File([''], 'bg.png', { type: 'image/png' });
  }

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load provinces on init', () => {
    expect(component.provinces.length).toBeGreaterThan(0);
    expect(component.provinces[0].name).toBe('Hà Nội');
  });

  it('should mark form invalid if required fields are missing', () => {
    component.eventForm.patchValue({ eventName: '', venueName: '' });
    expect(component.eventForm.valid).toBeFalse();
  });

  it('should add and remove tickets', () => {
    const initialLength = component.tickets.length;
    component.addTicket();
    expect(component.tickets.length).toBe(initialLength + 1);

    component.removeTicket(1);
    expect(component.tickets.length).toBe(initialLength);
  });

  it('should add and remove discounts', () => {
    const initialLength = component.discounts.length;
    component.addDiscount();
    expect(component.discounts.length).toBe(initialLength + 1);

    component.removeDiscount(0);
    expect(component.discounts.length).toBe(initialLength);
  });

  it('should show error toast when submitting invalid form', () => {
    spyOn(component, 'showErrorToast');
    component.onSubmit();
    expect(component.showErrorToast).toHaveBeenCalled();
  });

  it('should call createEventService when submitting valid form', fakeAsync(() => {
    setupValidForm();
    mockCreateEventService.createEvent.and.returnValue(of({ id: 1 }));

    component.onSubmit();
    tick(2000); // chạy qua setTimeout để Router.navigate được gọi

    expect(mockCreateEventService.createEvent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/organizer/events']);
  }));

  it('should handle error when createEventService fails', fakeAsync(() => {
    spyOn(component, 'showErrorToast');
    setupValidForm();
    mockCreateEventService.createEvent.and.returnValue(throwError(() => ({ status: 500 })));

    component.onSubmit();
    tick();

    // ✅ sửa message cho khớp với component của bạn
    expect(component.showErrorToast).toHaveBeenCalledWith('Đã có lỗi xảy ra khi tạo sự kiện. Vui lòng thử lại.');
  }));
});
