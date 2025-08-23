import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AdminService } from '../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Create a mock for AdminService
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  // Using jasmine.SpyObj to create a mock with spyable methods
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  // Mock data to be returned by the service spies
  const mockUserCount = 150;
  const mockEventCount = 45;
  const mockCompletedEventCount = 30;
  const mockOrdersResponse = {
    data: {
      listOrders: [
        { totalTicketsCount: 5, orderDate: '2023-10-26T10:00:00Z' },
        { totalTicketsCount: 3, orderDate: '2023-10-26T12:00:00Z' },
        { totalTicketsCount: 12, orderDate: '2023-10-27T11:00:00Z' },
      ],
    },
  };
  const mockTotalTickets = 20; // 5 + 3 + 12

  beforeEach(async () => {
    // Create a spy object for AdminService with all the methods that will be called
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getUserCount',
      'getEventCount',
      'getOrders',
      'getCompletedEventCount',
      'getEventCountByStatus',
      'getOrderCountByStatus'
    ]);

    // Configure the testing module
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule.forRoot([]), // Import RouterModule with empty routes for testing
        DashboardComponent // Import the standalone component
      ],
      providers: [
        // Provide the mock service instead of the real one
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    }).compileComponents();

    // Setup spies to return successful observable values by default for most tests
    adminServiceSpy.getUserCount.and.returnValue(of(mockUserCount));
    adminServiceSpy.getEventCount.and.returnValue(of(mockEventCount));
    adminServiceSpy.getOrders.and.returnValue(of(mockOrdersResponse));
    adminServiceSpy.getCompletedEventCount.and.returnValue(of(mockCompletedEventCount));
    adminServiceSpy.getEventCountByStatus.withArgs('pending').and.returnValue(of(10));
    adminServiceSpy.getEventCountByStatus.withArgs('approved').and.returnValue(of(25));
    adminServiceSpy.getEventCountByStatus.withArgs('rejected').and.returnValue(of(5));
    adminServiceSpy.getOrderCountByStatus.withArgs('pending').and.returnValue(of(5));
    adminServiceSpy.getOrderCountByStatus.withArgs('paid').and.returnValue(of(50));
    adminServiceSpy.getOrderCountByStatus.withArgs('cancelled').and.returnValue(of(2));

    // Create the component instance and fixture
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  // Test case to ensure the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test case for ngOnInit and successful data loading
  it('should load all counts and set isLoading to false on init', fakeAsync(() => {
    // Initial state check
    expect(component.isLoading).toBe(true);

    // Trigger ngOnInit
    fixture.detectChanges();

    // Use tick() to simulate the passage of time for async operations (Observables) to complete
    tick();

    // Assert that all data properties are updated correctly
    expect(component.userCount).toBe(mockUserCount);
    expect(component.eventCount).toBe(mockEventCount);
    expect(component.ticketCount).toBe(mockTotalTickets);
    expect(component.completedEventCount).toBe(mockCompletedEventCount);

    // Assert event statistics
    expect(component.eventStats.pending).toBe(10);
    expect(component.eventStats.approved).toBe(25);
    expect(component.eventStats.rejected).toBe(5);
    const totalEvents = 10 + 25 + 5;
    expect(component.eventStats.pendingPercent).toBeCloseTo((10 / totalEvents) * 100);
    expect(component.eventStats.approvedPercent).toBeCloseTo((25 / totalEvents) * 100);
    expect(component.eventStats.rejectedPercent).toBeCloseTo((5 / totalEvents) * 100);

    // Assert order statistics
    expect(component.orderStats.pending).toBe(5);
    expect(component.orderStats.paid).toBe(50);
    expect(component.orderStats.cancelled).toBe(2);
    const totalOrders = 5 + 50 + 2;
    expect(component.orderStats.paidPercent).toBeCloseTo((50 / totalOrders) * 100);

    // Assert ticket sales trend data is processed correctly
    expect(component.ticketSalesTrend.length).toBe(2);
    expect(component.ticketSalesTrend[0]).toEqual({ date: '2023-10-26', tickets: 8 });
    expect(component.ticketSalesTrend[1]).toEqual({ date: '2023-10-27', tickets: 12 });

    // Assert that isLoading is set to false after all calls complete
    expect(component.isLoading).toBe(false);

    // Verify that all expected service methods were called
    expect(adminServiceSpy.getUserCount).toHaveBeenCalledTimes(1);
    expect(adminServiceSpy.getEventCount).toHaveBeenCalledTimes(1);
    expect(adminServiceSpy.getOrders).toHaveBeenCalledTimes(1);
    expect(adminServiceSpy.getCompletedEventCount).toHaveBeenCalledTimes(1);
    expect(adminServiceSpy.getEventCountByStatus).toHaveBeenCalledWith('pending');
    expect(adminServiceSpy.getEventCountByStatus).toHaveBeenCalledWith('approved');
    expect(adminServiceSpy.getEventCountByStatus).toHaveBeenCalledWith('rejected');
  }));

  // Test case for handling an error when fetching user count
  it('should handle error when loading user count and still finish loading', fakeAsync(() => {
    // Setup one of the spies to return an error
    adminServiceSpy.getUserCount.and.returnValue(throwError(() => new Error('API Error')));
    const consoleErrorSpy = spyOn(console, 'error');

    // Trigger ngOnInit
    fixture.detectChanges();
    tick();

    // The user count should remain at its initial value
    expect(component.userCount).toBe(0);
    // The loading process should still complete
    expect(component.isLoading).toBe(false);
    // An error should be logged to the console
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading user count:', jasmine.any(Error));
  }));

  // Test case for handling an error when fetching completed event count
  it('should set completedEventCount to 0 on error', fakeAsync(() => {
    // Setup spy to return an error for this specific call
    adminServiceSpy.getCompletedEventCount.and.returnValue(throwError(() => new Error('API Error')));
    const consoleErrorSpy = spyOn(console, 'error');

    fixture.detectChanges();
    tick();

    // The count should be set to 0 as per the error block logic
    expect(component.completedEventCount).toBe(0);
    expect(component.isLoading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading completed event count:', jasmine.any(Error));
  }));

  // Test case for percentage calculations when total is zero
  it('should set percentages to 0 if total events is 0', () => {
    // Manually set stats to 0
    component.eventStats = { pending: 0, approved: 0, rejected: 0, pendingPercent: 0, approvedPercent: 0, rejectedPercent: 0 };
    // Call the private method (using bracket notation to access it)
    (component as any).updateEventPercentages();

    // Assert all percentages are 0
    expect(component.eventStats.pendingPercent).toBe(0);
    expect(component.eventStats.approvedPercent).toBe(0);
    expect(component.eventStats.rejectedPercent).toBe(0);
  });
});
