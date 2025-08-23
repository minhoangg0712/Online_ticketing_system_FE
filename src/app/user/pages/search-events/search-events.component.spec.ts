import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchEventsComponent } from './search-events.component';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';

describe('SearchEventsComponent', () => {
  let component: SearchEventsComponent;
  let fixture: ComponentFixture<SearchEventsComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    const spyService = jasmine.createSpyObj('EventsService', ['searchEvents']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [SearchEventsComponent, ToastNotificationComponent],
      providers: [
        { provide: EventsService, useValue: spyService },
        { provide: Router, useValue: spyRouter },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchEventsComponent);
    component = fixture.componentInstance;
    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    const mockResponse = { data: { listEvents: [{ id: 1 }], totalPages: 2 } };
    eventsServiceSpy.searchEvents.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(eventsServiceSpy.searchEvents).toHaveBeenCalled();
    expect(component.events.length).toBe(0);
    expect(component.totalPages).toBe(1);
  });

  it('should handle error when loading events', () => {
    eventsServiceSpy.searchEvents.and.returnValue(throwError(() => new Error('API error')));

    component.loadEvents();

    expect(component.isLoading).toBeTrue();
    expect(component.events.length).toBe(0);
  });

  it('should toggle category correctly', () => {
    spyOn(component.notification, 'showNotification');
    
    component.toggleCategory('Nhạc sống');
    expect(component.selectedCategories).toContain('Nhạc sống');

    // Try adding another category -> should show warning
    component.toggleCategory('Thể Thao');
    expect(component.selectedCategories.length).toBe(1);
    expect(component.notification.showNotification).toHaveBeenCalledWith('Chỉ được chọn tối đa 1 thể loại !', 3000, 'warning');

    // Remove category
    component.toggleCategory('Nhạc sống');
    expect(component.selectedCategories.length).toBe(0);
  });

  it('should reset filters', () => {
    component.selectedLocation = 'Hà Nội';
    component.selectedCategories = ['Nhạc sống'];

    component.resetFilter();

    expect(component.selectedLocation).toBe('Toàn quốc');
    expect(component.selectedCategories.length).toBe(0);
    expect(component.events.length).toBe(0);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should apply filters correctly', () => {
    component.selectedLocation = 'Hà Nội';
    component.selectedCategories = ['Nhạc sống'];

    component.applyFilter();

    expect(component.queryParams.address).toBe('Hà Nội');
    expect(component.queryParams.category).toBe('Music');
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should navigate to event detail', () => {
    component.goToEventDetail(123);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/detail-ticket/123']);
  });

  it('should handle scroll loading more events', fakeAsync(() => {
    const mockResponse = { data: { listEvents: [{ id: 1 }], totalPages: 2 } };
    eventsServiceSpy.searchEvents.and.returnValue(of(mockResponse));
    
    component.currentPage = 1;
    component.totalPages = 2;
    component.events = [];

    // Simulate scroll near bottom
    spyOnProperty(window, 'innerHeight').and.returnValue(1000);
    spyOnProperty(window, 'scrollY').and.returnValue(900);
    spyOnProperty(document.body, 'offsetHeight').and.returnValue(1900);

    component.onScroll();
    tick();

    expect(component.currentPage).toBe(1);
    expect(component.events.length).toBe(0);
  }));
});
