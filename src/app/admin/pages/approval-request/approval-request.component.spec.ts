import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../service/admin.service';
import { HttpClient } from '@angular/common/http';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdDate: string;
  updatedDate?: string;
  imageUrl?: string;
  backgroundUrl?: string;
  organizer: {
    id: number;
    name: string;
    avatar?: string;
    bio?: string;
    email?: string;
    phoneNumber?: string | null;
  };
  rejectionReason?: string;
  ticketPrices?: any;
  ticketsSold?: any;
}

@Component({
  selector: 'app-approval-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-request.component.html',
  styleUrls: ['./approval-request.component.css']
})
export class ApprovalRequestComponent implements OnInit {
  events: Event[] = [];
  loading: boolean = false;
  searchKeyword: string = '';
  selectedStatus: string = 'all';
  selectedCategory: string = 'all';
  uniqueCategories: string[] = ["Hội thảo", "Âm nhạc", "Thể thao", "Văn hóa"];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  selectedEvents: number[] = [];
  selectAll: boolean = false;
  showDetailModal: boolean = false;
  showRejectModal: boolean = false;
  showConfirmModal: boolean = false;
  selectedEvent: Event | null = null;
  rejectReason: string = '';
  confirmAction: string = '';
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };
  currentDate: Date = new Date();

  constructor(private adminService: AdminService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadEvents();
    this.loadStatistics();
  }

  loadEvents() {
    this.loading = true;
    this.selectAll = false;
    this.selectedEvents = [];

    const params = {
      name: this.searchKeyword || undefined,
      approvalStatus: this.selectedStatus === 'all' ? undefined : this.selectedStatus,
      category: this.selectedCategory === 'all' ? undefined : this.selectedCategory,
      page: this.currentPage,
      size: this.itemsPerPage
    };

    this.adminService.getEvents(params).subscribe({
      next: (response) => {
        console.log('Raw API response for events:', JSON.stringify(response, null, 2));
        if (response && response.data) {
          this.events = (response.data.listEvents || []).map((apiEvent: any) => ({
            id: apiEvent.eventId,
            title: apiEvent.eventName,
            description: apiEvent.description || 'Không có mô tả',
            startDate: apiEvent.startTime ? apiEvent.startTime.split('T')[0] : '',
            endDate: apiEvent.endTime ? apiEvent.endTime.split('T')[0] : '',
            startTime: apiEvent.startTime ? apiEvent.startTime.split('T')[1].substring(0, 5) : '',
            endTime: apiEvent.endTime ? apiEvent.endTime.split('T')[1].substring(0, 5) : '',
            location: apiEvent.address || 'Chưa cung cấp địa chỉ',
            category: apiEvent.category || 'Không xác định',
            status: apiEvent.approvalStatus,
            createdDate: apiEvent.createdAt || apiEvent.updateAt,
            updatedDate: apiEvent.updateAt,
            imageUrl: apiEvent.logoUrl,
            backgroundUrl: apiEvent.backgroundUrl,
            organizer: {
              id: apiEvent.organizerId || 0,
              name: apiEvent.organizerName || 'Không xác định',
              avatar: apiEvent.organizerAvatarUrl,
              bio: apiEvent.organizerBio,
              email: apiEvent.organizerEmail,
              phoneNumber: apiEvent.organizerPhoneNumber
            },
            rejectionReason: apiEvent.rejectReason || ''
          }));
          this.totalItems = response.data.totalPages * response.data.pageSize || 0; // Tính toán tạm thời
          this.currentPage = response.data.pageNo || 1;
          this.itemsPerPage = response.data.pageSize || 10;
        } else {
          this.events = [];
          this.totalItems = 0;
          this.currentPage = 1;
          this.itemsPerPage = 10;
        }
        this.loading = false;
        this.updateSelectAll();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.showError('Có lỗi xảy ra khi tải danh sách sự kiện!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStatistics() {
    this.adminService.getEventCount().subscribe({
      next: (count) => (this.stats.total = count || 0),
      error: (error) => console.error('Error loading total events:', error)
    });
    this.adminService.getEventCountByStatus('pending').subscribe({
      next: (count) => (this.stats.pending = count || 0),
      error: (error) => console.error('Error loading pending events:', error)
    });
    this.adminService.getEventCountByStatus('approved').subscribe({
      next: (count) => (this.stats.approved = count || 0),
      error: (error) => console.error('Error loading approved events:', error)
    });
    this.adminService.getEventCountByStatus('rejected').subscribe({
      next: (count) => (this.stats.rejected = count || 0),
      error: (error) => console.error('Error loading rejected events:', error)
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadEvents();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadEvents();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadEvents();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages() && page !== this.currentPage) {
      this.currentPage = page;
      this.loadEvents();
    }
  }

  getDisplayEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.totalItems);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  formatDate1(date: Date): string {
    if (!date || isNaN(date.getTime())) return 'Không xác định';
    return date.toLocaleDateString('vi-VN');
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  }

  showSuccess(message: string) {
    console.log('Success:', message);
    alert(message);
  }

  showError(message: string) {
    console.error('Error:', message);
    alert(message);
  }

  viewRejectionReason(event: Event) {
    if (event.rejectionReason) {
      this.showSuccess(`Lý do từ chối: ${event.rejectionReason}`);
    } else {
      this.showError('Không có lý do từ chối được ghi nhận.');
    }
  }

  private downloadFile(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  exportEventExcel(eventId: number) {
    this.loading = true;
    const url = `http://113.20.107.77:8080/api/events/${eventId}/report/excel`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response, `event_${eventId}_report.xlsx`);
        this.showSuccess('Xuất file Excel thành công!');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error exporting Excel:', error);
        this.showError('Có lỗi xảy ra khi xuất file Excel!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  batchExportExcel() {
    if (this.selectedEvents.length === 0) {
      this.showError('Vui lòng chọn ít nhất một sự kiện để xuất!');
      return;
    }
    this.loading = true;
    const exportPromises = this.selectedEvents.map(eventId => {
      const url = `http://113.20.107.77:8080/api/events/${eventId}/report/excel`;
      return this.http.get(url, { responseType: 'blob' }).toPromise().then((response: Blob | undefined) => {
        if (response) {
          this.downloadFile(response, `event_${eventId}_report.xlsx`);
        }
      });
    });
    Promise.all(exportPromises)
      .then(() => {
        this.showSuccess(`Đã xuất ${this.selectedEvents.length} file Excel thành công!`);
        this.loading = false;
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Error batch exporting Excel:', error);
        this.showError('Có lỗi xảy ra khi xuất hàng loạt file Excel!');
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  exportEventPdf(eventId: number) {
    this.loading = true;
    const url = `http://113.20.107.77:8080/api/events/${eventId}/report/pdf`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response, `event_${eventId}_report.pdf`);
        this.showSuccess('Xuất file PDF thành công!');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error exporting PDF:', error);
        this.showError('Có lỗi xảy ra khi xuất file PDF!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  batchExportPdf() {
    if (this.selectedEvents.length === 0) {
      this.showError('Vui lòng chọn ít nhất một sự kiện để xuất!');
      return;
    }
    this.loading = true;
    const exportPromises = this.selectedEvents.map(eventId => {
      const url = `http://113.20.107.77:8080/api/events/${eventId}/report/pdf`;
      return this.http.get(url, { responseType: 'blob' }).toPromise().then((response: Blob | undefined) => {
        if (response) {
          this.downloadFile(response, `event_${eventId}_report.pdf`);
        }
      });
    });
    Promise.all(exportPromises)
      .then(() => {
        this.showSuccess(`Đã xuất ${this.selectedEvents.length} file PDF thành công!`);
        this.loading = false;
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Error batch exporting PDF:', error);
        this.showError('Có lỗi xảy ra khi xuất hàng loạt file PDF!');
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  toggleEventSelection(eventId: number) {
    const index = this.selectedEvents.indexOf(eventId);
    if (index > -1) {
      this.selectedEvents.splice(index, 1);
    } else {
      this.selectedEvents.push(eventId);
    }
    this.updateSelectAll();
    this.cdr.detectChanges();
  }

  toggleSelectAll() {
    const paginatedEventIds = this.events.map(event => event.id);
    if (this.selectAll) {
      paginatedEventIds.forEach(id => {
        if (!this.selectedEvents.includes(id)) {
          this.selectedEvents.push(id);
        }
      });
    } else {
      this.selectedEvents = this.selectedEvents.filter(id => !paginatedEventIds.includes(id));
    }
    this.cdr.detectChanges();
  }

  updateSelectAll() {
    if (this.events.length === 0) {
      this.selectAll = false;
      return;
    }
    this.selectAll = this.events.every(event => this.selectedEvents.includes(event.id));
    this.cdr.detectChanges();
  }

  isEventSelected(eventId: number): boolean {
    return this.selectedEvents.includes(eventId);
  }

  approveEvent(eventId: number) {
    this.loading = true;
    this.adminService.approveEvent(eventId).subscribe({
      next: (response) => {
        this.showSuccess('Sự kiện đã được duyệt thành công!');
        this.loadEvents();
        this.loadStatistics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error approving event:', error);
        this.showError('Có lỗi xảy ra khi duyệt sự kiện!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  rejectEvent(eventId: number, reason: string) {
    this.loading = true;
    this.adminService.rejectEvent(eventId, reason).subscribe({
      next: () => {
        this.showSuccess('Sự kiện đã bị từ chối!');
        this.loadEvents();
        this.loadStatistics();
        this.showRejectModal = false;
        this.rejectReason = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error rejecting event:', error);
        this.showError('Có lỗi xảy ra khi từ chối sự kiện!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  revokeApproval(eventId: number) {
    this.loading = true;
    this.adminService.revokeApproval(eventId).subscribe({
      next: () => {
        this.showSuccess('Đã thu hồi duyệt sự kiện!');
        this.loadEvents();
        this.loadStatistics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error revoking approval:', error);
        this.showError('Có lỗi xảy ra khi thu hồi duyệt!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteEvent(eventId: number) {
    this.loading = true;
    this.adminService.deleteEvent(eventId).subscribe({
      next: () => {
        this.showSuccess('Sự kiện đã được xóa!');
        this.loadEvents();
        this.loadStatistics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.showError('Có lỗi xảy ra khi xóa sự kiện!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  batchApprove() {
    if (this.selectedEvents.length === 0) {
      this.showError('Vui lòng chọn ít nhất một sự kiện!');
      return;
    }
    this.loading = true;
    this.adminService.approveEvents(this.selectedEvents).subscribe({
      next: () => {
        this.showSuccess(`Đã duyệt ${this.selectedEvents.length} sự kiện!`);
        this.selectedEvents = [];
        this.selectAll = false;
        this.loadEvents();
        this.loadStatistics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error approving events:', error);
        this.showError('Có lỗi xảy ra khi duyệt hàng loạt!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  batchReject() {
    if (this.selectedEvents.length === 0) {
      this.showError('Vui lòng chọn ít nhất một sự kiện!');
      return;
    }
    this.loading = true;
    this.adminService.rejectEvents(this.selectedEvents, this.rejectReason).subscribe({
      next: () => {
        this.showSuccess(`Đã từ chối ${this.selectedEvents.length} sự kiện!`);
        this.selectedEvents = [];
        this.selectAll = false;
        this.showRejectModal = false;
        this.rejectReason = '';
        this.loadEvents();
        this.loadStatistics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error rejecting events:', error);
        this.showError('Có lỗi xảy ra khi từ chối hàng loạt!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  batchDelete() {
    if (this.selectedEvents.length === 0) {
      this.showError('Vui lòng chọn ít nhất một sự kiện!');
      return;
    }
    this.loading = true;
    this.adminService.deleteEvents(this.selectedEvents).subscribe({
      next: () => {
        this.showSuccess(`Đã xóa ${this.selectedEvents.length} sự kiện!`);
        this.selectedEvents = [];
        this.selectAll = false;
        this.loadEvents();
        this.loadStatistics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting events:', error);
        this.showError('Có lỗi xảy ra khi xóa hàng loạt!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewEventDetail(event: Event) {
    this.loading = true;
    this.adminService.getEventById(event.id).subscribe({
      next: (response) => {
        if (response && response.data) {
          const apiEvent = response.data;
          this.selectedEvent = {
            id: apiEvent.eventId,
            title: apiEvent.eventName,
            description: apiEvent.description || 'Không có mô tả',
            startDate: apiEvent.startTime ? apiEvent.startTime.split('T')[0] : '',
            endDate: apiEvent.endTime ? apiEvent.endTime.split('T')[0] : '',
            startTime: apiEvent.startTime ? apiEvent.startTime.split('T')[1].substring(0, 5) : '',
            endTime: apiEvent.endTime ? apiEvent.endTime.split('T')[1].substring(0, 5) : '',
            location: apiEvent.address || 'Chưa cung cấp địa chỉ',
            category: apiEvent.category || 'Không xác định',
            status: apiEvent.approvalStatus,
            createdDate: apiEvent.createdAt || apiEvent.updateAt,
            updatedDate: apiEvent.updateAt,
            imageUrl: apiEvent.logoUrl || 'https://via.placeholder.com/300x200/007bff/ffffff?text=Event',
            backgroundUrl: apiEvent.backgroundUrl || 'https://via.placeholder.com/300x200/007bff/ffffff?text=Background',
            organizer: {
              id: apiEvent.organizerId || 0,
              name: apiEvent.organizerName || 'Không xác định',
              avatar: apiEvent.organizerAvatarUrl || 'https://via.placeholder.com/32x32/28a745/ffffff?text=User',
              bio: apiEvent.organizerBio || 'Chưa có thông tin',
              email: apiEvent.organizerEmail || 'Chưa cung cấp',
              phoneNumber: apiEvent.organizerPhoneNumber || 'Chưa cung cấp'
            },
            rejectionReason: apiEvent.rejectReason || '',
            ticketPrices: apiEvent.ticketPrices || {},
            ticketsSold: apiEvent.ticketsSold || {}
          };
          this.showDetailModal = true;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading event detail:', error);
        this.showError('Có lỗi xảy ra khi tải chi tiết sự kiện!');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToEventDetail(eventId: number) {
    console.log('Navigate to event detail:', eventId);
  }

  openRejectModal(event: Event) {
    this.selectedEvent = event;
    this.showRejectModal = true;
    this.cdr.detectChanges();
  }

  openConfirmModal(action: string, event?: Event) {
    this.confirmAction = action;
    this.selectedEvent = event || null;
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  confirmModalAction() {
    if (!this.selectedEvent) return;
    switch (this.confirmAction) {
      case 'approve':
        this.approveEvent(this.selectedEvent.id);
        break;
      case 'revoke':
        this.revokeApproval(this.selectedEvent.id);
        break;
      case 'delete':
        this.deleteEvent(this.selectedEvent.id);
        break;
    }
    this.showConfirmModal = false;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showDetailModal = false;
    this.showRejectModal = false;
    this.showConfirmModal = false;
    this.selectedEvent = null;
    this.rejectReason = '';
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'fas fa-clock';
      case 'approved': return 'fas fa-check';
      case 'rejected': return 'fas fa-times';
      default: return 'fas fa-question';
    }
  }
}
