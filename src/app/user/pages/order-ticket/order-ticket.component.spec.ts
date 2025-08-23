import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderTicketComponent } from './order-ticket.component';
import { Router } from '@angular/router';
import { TicketOrderService } from '../../services/ticket-order.service';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';

// Mock service
class MockTicketOrderService {
  getOrder = jasmine.createSpy('getOrder').and.returnValue({ eventId: 1, totalAmount: 100000 });
  payOrder = jasmine.createSpy('payOrder').and.returnValue(of({ data: { checkoutUrl: 'http://pay-url' } }));
}

class MockEventsService {
  getEventById = jasmine.createSpy('getEventById').and.returnValue(of({ data: { eventId: 1, name: 'Mock Event' } }));
}

class MockUserService {
  getDiscountByCode = jasmine.createSpy('getDiscountByCode').and.returnValue(
    of({
      data: {
        event: { eventId: 1 },
        validFrom: new Date(Date.now() - 1000).toISOString(),
        validTo: new Date(Date.now() + 100000).toISOString(),
        maxUsage: 10,
        discountType: 'percentage',
        value: 10
      }
    })
  );
}

describe('OrderTicketComponent', () => {
  let component: OrderTicketComponent;
  let fixture: ComponentFixture<OrderTicketComponent>;
  let ticketOrderService: MockTicketOrderService;
  let userService: MockUserService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OrderTicketComponent, ToastNotificationComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: TicketOrderService, useClass: MockTicketOrderService },
        { provide: EventsService, useClass: MockEventsService },
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderTicketComponent);
    component = fixture.componentInstance;
    ticketOrderService = TestBed.inject(TicketOrderService) as any;
    userService = TestBed.inject(UserService) as any;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load event detail on init', fakeAsync(() => {
    ticketOrderService.getOrder.and.returnValue({ eventId: 1, totalAmount: 100000 });
    component.ngOnInit();
    tick(100); // khớp với setTimeout(100) trong component
    expect(ticketOrderService.getOrder).toHaveBeenCalled();
    expect(component.orderData.eventId).toBe(1);
  }));


  it('should apply discount correctly', fakeAsync(() => {
    component.orderData = { eventId: 1, totalAmount: 100000 }; // cần set
    component.discountCode = 'SALE10';
    component.applyDiscount();
    tick();
    expect(userService.getDiscountByCode).toHaveBeenCalledWith('SALE10');
    expect(component.isDiscountValid).toBeTrue();
    expect(component.discountAmount).toBeGreaterThan(0);
  }));


  it('should calculate final amount correctly', () => {
    component.orderData = { totalAmount: 100000 };
    component.discountAmount = 20000;
    const final = component.getFinalAmount();
    expect(final).toBe(80000);
  });

  it('should navigate back when timer ends', fakeAsync(() => {
    component.orderData = { eventId: 99 };
    spyOn(component.notification, 'showNotification');
    component['onTimerEnd']();
    tick(3000);
    expect(router.navigate).toHaveBeenCalledWith(['/select-ticket', 99]);
  }));
});
