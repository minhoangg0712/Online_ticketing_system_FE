import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { OrdersRequestComponent } from './orders-request.component';
import { AdminService } from '../service/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Mock data for the tests
const mockApiOrdersResponse = {
  data: {
    listOrders: [
      { orderId: 1, userName: 'John Doe', userEmail: 'john@example.com', orderPayOSCode: 101, status: 'paid', totalAmount: 50000, orderDate: '2023-10-27T10:00:00Z', totalTicketsCount: 2 },
      { orderId: 2, userName: 'Jane Smith', userEmail: 'jane@example.com', orderPayOSCode: 102, status: 'pending', totalAmount: 75000, orderDate: '2023-10-28T11:00:00Z', totalTicketsCount: 3 },
      { orderId: 3, userName: 'Peter Jones', userEmail: 'peter@example.com', orderPayOSCode: 103, status: 'cancelled', totalAmount: 25000, orderDate: '2023-10-29T12:00:00Z', totalTicketsCount: 1, cancellationReason: 'Out of stock' },
    ],
    totalElements: 3,
  },
};

const mockOrderDetail = {
  data: {
    id: 'detail-123',
    orderCode: 101,
    amount: 50000,
    amountPaid: 50000,
    amountRemaining: 0,
    status: 'PAID',
    createdAt: '2023-10-27T10:00:00Z',
    transactions: [],
  }
};

describe('OrdersRequestComponent', () => {
  let component: OrdersRequestComponent;
  let fixture: ComponentFixture<OrdersRequestComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    // Create a spy object for AdminService
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getOrders',
      'getOrderCountByStatus',
      'getOrderDetail',
      'cancelOrder'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        OrdersRequestComponent // Import standalone component
      ],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    }).compileComponents();

    // Setup default successful responses for spies
    adminServiceSpy.getOrders.and.returnValue(of(mockApiOrdersResponse));
    adminServiceSpy.getOrderCountByStatus.withArgs('pending').and.returnValue(of(1));
    adminServiceSpy.getOrderCountByStatus.withArgs('paid').and.returnValue(of(1));
    adminServiceSpy.getOrderCountByStatus.withArgs('cancelled').and.returnValue(of(1));
    adminServiceSpy.getOrderDetail.and.returnValue(of(mockOrderDetail));
    adminServiceSpy.cancelOrder.and.returnValue(of({ data: { status: 'CANCELLED' } }));


    fixture = TestBed.createComponent(OrdersRequestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Testing Initialization ---
  describe('ngOnInit', () => {
    it('should load orders and statistics on initialization', fakeAsync(() => {
      fixture.detectChanges(); // triggers ngOnInit
      tick();

      expect(component.loading).toBe(false);
      expect(component.orders.length).toBe(3);
      expect(component.totalItems).toBe(3);
      expect(adminServiceSpy.getOrders).toHaveBeenCalledTimes(2); // Once for orders, once for total stats

      expect(component.stats.pending).toBe(1);
      expect(component.stats.paid).toBe(1);
      expect(component.stats.cancelled).toBe(1);
      expect(adminServiceSpy.getOrderCountByStatus).toHaveBeenCalledTimes(3);
    }));

     it('should handle error when loading orders', fakeAsync(() => {
      adminServiceSpy.getOrders.and.returnValue(throwError(() => new HttpErrorResponse({status: 500})));
      const consoleErrorSpy = spyOn(console, 'error');

      fixture.detectChanges();
      tick();

      expect(component.loading).toBe(false);
      expect(component.orders.length).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading orders:', jasmine.any(HttpErrorResponse));
    }));
  });

  // --- Testing Filtering ---
  describe('Filtering', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should filter by search keyword (userName)', () => {
      component.searchKeyword = 'John';
      component.onSearch();
      expect(component.filteredOrders.length).toBe(1);
      expect(component.filteredOrders[0].userName).toBe('John Doe');
    });

    it('should filter by search keyword (orderPayOSCode)', () => {
      component.searchKeyword = '102';
      component.onSearch();
      expect(component.filteredOrders.length).toBe(1);
      expect(component.filteredOrders[0].userName).toBe('Jane Smith');
    });

    it('should trigger loadOrders when status changes', () => {
      component.selectedStatus = 'paid';
      component.onStatusChange();
      // The second call is from onStatusChange
      expect(adminServiceSpy.getOrders).toHaveBeenCalledTimes(3);
      expect(adminServiceSpy.getOrders).toHaveBeenCalledWith(jasmine.objectContaining({ status: 'paid' }));
    });
  });

  // --- Testing Pagination ---
  describe('Pagination', () => {
    beforeEach(fakeAsync(() => {
        // Create a larger mock response for pagination testing
        const largeMockResponse = {
            data: {
                listOrders: Array.from({ length: 25 }, (_, i) => ({ orderId: i + 1, status: 'paid' })),
                totalElements: 25,
            }
        };
        adminServiceSpy.getOrders.and.returnValue(of(largeMockResponse));
        fixture.detectChanges();
        tick();
    }));

    it('should return the correct number of total pages', () => {
        component.itemsPerPage = 10;
        expect(component.getTotalPages()).toBe(3); // 25 items / 10 per page = 2.5 -> ceil = 3
    });

    it('should go to a specific page', () => {
        component.goToPage(2);
        expect(component.currentPage).toBe(2);
    });

    it('should not go to an invalid page (less than 1 or greater than total)', () => {
        component.goToPage(0);
        expect(component.currentPage).toBe(1);
        component.goToPage(100); // Assuming total pages is less than 100
        expect(component.currentPage).toBe(1);
    });

    it('getPaginatedOrders should return the correct slice of orders for the current page', () => {
        component.itemsPerPage = 10;
        component.currentPage = 2;
        const paginated = component.getPaginatedOrders();
        expect(paginated.length).toBe(10);
        expect(paginated[0].id).toBe(11); // 11th item in the array
    });
  });

  // --- Testing Modals and Actions ---
  describe('Modals and Actions', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should open detail modal with correct data on viewOrderDetail', fakeAsync(() => {
      const orderToView = component.orders[0]; // John Doe's order
      component.viewOrderDetail(orderToView);
      tick();

      expect(component.loading).toBe(false);
      expect(component.showDetailModal).toBe(true);
      expect(component.selectedOrderDetail).not.toBeNull();
      expect(component.selectedOrderDetail?.orderCode).toBe(101);
      expect(adminServiceSpy.getOrderDetail).toHaveBeenCalledWith(101);
    }));

    it('should open cancel modal on initiateCancelOrder', () => {
        const orderToCancel = component.orders[1]; // Jane's pending order
        component.initiateCancelOrder(orderToCancel);

        expect(component.showCancelModal).toBe(true);
        expect(component.orderToCancel).toEqual(orderToCancel);
    });

    it('should not open cancel modal for an already cancelled order', () => {
        const cancelledOrder = component.orders[2];
        const showErrorSpy = spyOn(component, 'showError');
        component.initiateCancelOrder(cancelledOrder);

        expect(component.showCancelModal).toBe(false);
        expect(showErrorSpy).toHaveBeenCalledWith('Đơn hàng đã bị hủy!');
    });

    it('should successfully cancel an order on confirmCancelOrder', fakeAsync(() => {
        const orderToCancel = component.orders[1];
        component.orderToCancel = orderToCancel;
        component.cancellationReason = 'User request';

        component.confirmCancelOrder();
        tick();

        expect(adminServiceSpy.cancelOrder).toHaveBeenCalledWith(orderToCancel.orderPayOSCode, 'User request');
        expect(component.showCancelModal).toBe(false);
        // It should reload orders and stats
        expect(adminServiceSpy.getOrders).toHaveBeenCalled();
        expect(adminServiceSpy.getOrderCountByStatus).toHaveBeenCalled();
    }));
  });

  // --- Testing Utility Functions ---
  describe('Utility Functions', () => {
    it('getStatusClass should return correct badge class', () => {
        expect(component.getStatusClass('PENDING')).toBe('badge-warning');
        expect(component.getStatusClass('PAID')).toBe('badge-success');
        expect(component.getStatusClass('CANCELLED')).toBe('badge-danger');
        expect(component.getStatusClass('UNKNOWN')).toBe('badge-secondary');
    });

    it('formatDateTime should format date string correctly', () => {
        const dateString = '2023-10-27T10:30:00Z';
        const expected = new Date(dateString).toLocaleString('vi-VN');
        expect(component.formatDateTime(dateString)).toBe(expected);
        expect(component.formatDateTime('')).toBe('Không xác định');
    });

    it('formatCurrency should format number to VND currency', () => {
        expect(component.formatCurrency(123456)).toBe('123.456 ₫');
    });
  });
});
