import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailTicketComponent } from './detail-ticket.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';
import { Meta, Title } from '@angular/platform-browser';

// Mock service
class MockRouter {
  navigate = jasmine.createSpy('navigate');
  navigateByUrl = jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve(true));
}
class MockAuthService {
  isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
}
class MockEventsService {
  getEventById = jasmine.createSpy('getEventById').and.returnValue(of({ data: {
    eventId: 1,
    eventName: 'Test Event',
    description: 'desc',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600*1000).toISOString(), // chưa kết thúc
    ticketsSaleStartTime: new Date(Date.now() - 1000).toISOString(),
    backgroundUrl: 'url',
    organizerName: 'org',
    organizerBio: 'bio',
    organizerAvatarUrl: 'ava',
    address: 'Địa chỉ A, Quận 1, TP HCM',
    ticketPrices: { vip: 100 },
    ticketsSold: { vip: 1 },
    ticketsTotal: { vip: 10 }
  }}));
  getRecommendedEvents = jasmine.createSpy('getRecommendedEvents').and.returnValue(of({ data: { listEvents: [] } }));
}
class MockUserService {
  getReviewsByEvent = jasmine.createSpy('getReviewsByEvent').and.returnValue(of({ data: { reviewDetails: [] } }));
}

describe('DetailTicketComponent', () => {
  let component: DetailTicketComponent;
  let fixture: ComponentFixture<DetailTicketComponent>;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTicketComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useClass: MockAuthService },
        { provide: EventsService, useClass: MockEventsService },
        { provide: UserService, useClass: MockUserService },
        { provide: Meta, useValue: { updateTag: jasmine.createSpy('updateTag') } },
        { provide: Title, useValue: { setTitle: jasmine.createSpy('setTitle') } },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTicketComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle rows', () => {
    expect(component.expanded).toBeFalse();
    component.toggleRows();
    expect(component.expanded).toBeTrue();
  });

  it('should check login and navigate to captcha', () => {
    const auth = TestBed.inject(AuthService) as any;
    auth.isLoggedIn.and.returnValue(true);
    component.needLoginToBuyTicket();
    expect(router.navigate).toHaveBeenCalledWith(['/slider-captcha'], { queryParams: { eventId: 1 } });
  });

  it('should detect all tickets sold out', () => {
    component.eventData.ticketPrices = [{ isSoldOut: true }];
    expect(component.isAllTicketsSoldOut()).toBeTrue();
  });

  it('should detect single ticket sold out by type', () => {
    component.eventData.ticketPrices = [{ type: 'vip', isSoldOut: true }];
    expect(component.isTicketSoldOut('vip')).toBeTrue();
    expect(component.isTicketSoldOut('normal')).toBeFalse();
  });

  it('should generate stars correctly', () => {
    component.averageRating = 4.5;
    component.generateStars();
    expect(component.stars).toContain('half');
    expect(component.stars.length).toBe(5);
  });

  it('should return google map url', () => {
    const url = component.getGoogleMapUrl('Q1', 'TP HCM');
    expect(url).toContain('google.com/maps/search');
  });

  it('should toggle main section', () => {
    expect(component.isMainExpanded).toBeTrue();
    component.toggleMainSection();
    expect(component.isMainExpanded).toBeFalse();
  });
});
