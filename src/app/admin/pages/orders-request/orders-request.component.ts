import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../service/admin.service';

interface Order {
  id: number;
  userName: string;
  userEmail: string;
  orderPayOSCode: number;
  status: 'pending' | 'paid' | 'cancelled';
  totalAmount: number;
  orderDate: string;
  totalTicketsCount: number;
  cancellationReason?: string;
}

interface OrderDetail {
  id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  transactions: any[];
  cancellationReason?: string;
  canceledAt?: string;
}

@Component({
  selector: 'app-orders-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-request.component.html',
  styleUrls: ['./orders-request.component.css']
})
export class OrdersRequestComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  searchKeyword: string = '';
  selectedStatus: string = 'all';
  startAmount: number | null = null;
  endAmount: number | null = null;
  startTime: string = '';
  endTime: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  showDetailModal: boolean = false;
  showCancelModal: boolean = false;
  selectedOrderDetail: OrderDetail | null = null;
  orderToCancel: Order | null = null;
  cancellationReason: string = '';

  stats = {
    total: 0,
    pending: 0,
    paid: 0,
    cancelled: 0
  };

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadOrders();
    this.loadStatistics();
  }

  loadOrders() {
    this.loading = true;
    const params = {
      status: this.selectedStatus === 'all' ? undefined : this.selectedStatus,
      startAmount: this.startAmount || undefined,
      endAmount: this.endAmount || undefined,
      startTime: this.startTime || undefined,
      endTime: this.endTime || undefined,
      page: this.currentPage, // Backend expects 1-based
      size: this.itemsPerPage
    };

    this.adminService.getOrders(params).subscribe({
      next: (response) => {
        console.log('Raw API response for orders:', JSON.stringify(response, null, 2));
        if (response && response.data && response.data.listOrders) {
          this.orders = response.data.listOrders.map((apiOrder: any) => ({
            id: apiOrder.orderId,
            userName: apiOrder.userName || 'Không xác định',
            userEmail: apiOrder.userEmail || 'Không xác định',
            orderPayOSCode: apiOrder.orderPayOSCode || 0,
            status: apiOrder.status.toLowerCase(),
            totalAmount: apiOrder.totalAmount || 0,
            orderDate: apiOrder.orderDate,
            totalTicketsCount: apiOrder.totalTicketsCount || 0,
            cancellationReason: apiOrder.cancellationReason || undefined
          }));
          this.totalItems = response.data.totalElements || (response.data.totalPages * response.data.pageSize) || this.orders.length;
          this.currentPage = response.data.pageNo || 1;
          this.itemsPerPage = response.data.pageSize || 10;
        } else {
          this.orders = [];
          this.totalItems = 0;
          this.currentPage = 1;
          this.itemsPerPage = 10;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.showError('Có lỗi xảy ra khi tải danh sách đơn hàng!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStatistics() {
    this.adminService.getOrderCountByStatus('pending').subscribe({
      next: (count) => { this.stats.pending = count; this.cdr.detectChanges(); },
      error: (error) => console.error('Error loading pending orders:', error)
    });
    this.adminService.getOrderCountByStatus('paid').subscribe({
      next: (count) => { this.stats.paid = count; this.cdr.detectChanges(); },
      error: (error) => console.error('Error loading paid orders:', error)
    });
    this.adminService.getOrderCountByStatus('cancelled').subscribe({
      next: (count) => { this.stats.cancelled = count; this.cdr.detectChanges(); },
      error: (error) => console.error('Error loading cancelled orders:', error)
    });
    this.adminService.getOrders({}).subscribe({
      next: (response) => {
        this.stats.total = response.data.totalElements || (response.data.totalPages * response.data.pageSize) || 0;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading total orders:', error)
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onAmountChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onDateChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages() && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  getDisplayEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.totalItems);
  }

  viewOrderDetail(order: Order) {
    this.loading = true;
    this.adminService.getOrderDetail(order.orderPayOSCode).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.selectedOrderDetail = {
            id: response.data.id,
            orderCode: response.data.orderCode,
            amount: response.data.amount,
            amountPaid: response.data.amountPaid,
            amountRemaining: response.data.amountRemaining,
            status: response.data.status,
            createdAt: response.data.createdAt,
            transactions: response.data.transactions || [],
            cancellationReason: response.data.cancellationReason || undefined,
            canceledAt: response.data.canceledAt || undefined
          };
          this.orderToCancel = order;
          this.showDetailModal = true;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading order detail:', error);
        this.showError('Có lỗi xảy ra khi tải chi tiết đơn hàng!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initiateCancelOrder(order: Order) {
    if (order.status === 'cancelled') {
      this.showError('Đơn hàng đã bị hủy!');
      return;
    }
    this.orderToCancel = order;
    this.cancellationReason = '';
    this.showCancelModal = true;
    this.cdr.detectChanges();
  }

  confirmCancelOrder() {
    if (!this.orderToCancel) return;
    this.loading = true;
    this.adminService.cancelOrder(this.orderToCancel.orderPayOSCode, this.cancellationReason).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.showSuccess('Hủy đơn hàng thành công!');
          this.closeCancelModal();
          this.loadOrders();
          this.loadStatistics();
          if (this.showDetailModal && this.selectedOrderDetail && this.selectedOrderDetail.orderCode === this.orderToCancel?.orderPayOSCode) {
            this.viewOrderDetail(this.orderToCancel);
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        this.showError('Có lỗi xảy ra khi hủy đơn hàng!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.orderToCancel = null;
    this.cancellationReason = '';
    this.cdr.detectChanges();
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedOrderDetail = null;
    this.orderToCancel = null;
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'badge-warning';
      case 'PAID': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'Chờ thanh toán';
      case 'PAID': return 'Đã thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Không xác định';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'fas fa-clock';
      case 'PAID': return 'fas fa-check';
      case 'CANCELLED': return 'fas fa-times';
      default: return 'fas fa-question';
    }
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  showSuccess(message: string) {
    console.log('Success:', message);
    alert(message);
  }

  showError(message: string) {
    console.error('Error:', message);
    alert(message);
  }
}
