import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ListEventsService } from '../../services/list-events.service';

// Giao diện cho dữ liệu sự kiện
interface EventData {
  id: number;
  eventName: string;
  startTime: string;
  endTime: string;
  address: string;
  category: string;
  description: string;
}

// Giao diện cho dữ liệu thống kê vé
interface TicketTypeStats {
  ticketType: string;
  totalQuantity: number;
  soldQuantity: number;
  remainingQuantity: number;
  price: number;
}

// Giao diện cho tổng thống kê
interface TicketStats {
  totalTickets: number;
  soldTickets: number;
  remainingTickets: number;
  totalRevenue: number;
  ticketTypes: TicketTypeStats[];
}

@Component({
  selector: 'app-export-file-detail',
  templateUrl: './export-file-detail.component.html',
  styleUrls: ['./export-file-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class ExportFileDetailComponent implements OnInit {
  eventId!: number;
  eventData: EventData | null = null;

  ticketStats: TicketStats = {
    totalTickets: 0,
    soldTickets: 0,
    remainingTickets: 0,
    totalRevenue: 0,
    ticketTypes: []
  };

  isLoading = true;
  isLoadingStats = true;
  isDownloadingPdf = false;
  isDownloadingExcel = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private listEventsService: ListEventsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.eventId) {
      console.error('ID sự kiện không hợp lệ!');
      this.isLoading = false;
      this.isLoadingStats = false;
      return;
    }

    this.loadEventData();
    this.loadTicketStatistics();
  }

  goBack(): void {
    this.location.back();
  }

  private loadEventData(): void {
    this.listEventsService.getEventById(this.eventId.toString()).subscribe({
      next: res => {
        this.eventData = res?.data || null;
        this.isLoading = false;
      },
      error: err => {
        console.error('Lỗi khi tải thông tin sự kiện:', err);
        this.eventData = null;
        this.isLoading = false;
      }
    });
  }

  private loadTicketStatistics(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không tìm thấy token!');
      this.isLoadingStats = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ data: any }>(
      `http://localhost:8080/api/events/${this.eventId}`, { headers }
    ).subscribe({
      next: res => {
        const data = res.data;
        console.log('API Response:', data); // Debug log

        const ticketTypesStats: TicketTypeStats[] = [];

        // Parse dữ liệu từ API response theo cấu trúc thực tế
        if (data.ticketTypes && data.ticketPrices && data.ticketsTotal && data.ticketsSold) {
          // Lặp qua các ticket types (ví dụ: {"14": "vip"})
          Object.keys(data.ticketTypes).forEach(key => {
            const ticketType = data.ticketTypes[key]; // "vip"
            const price = data.ticketPrices[ticketType] || 0; // 10000.0
            const totalQuantity = data.ticketsTotal[ticketType] || 0; // 10
            const soldQuantity = data.ticketsSold[ticketType] || 0; // 0
            
            ticketTypesStats.push({
              ticketType: ticketType,
              totalQuantity: totalQuantity,
              soldQuantity: soldQuantity,
              remainingQuantity: totalQuantity - soldQuantity,
              price: price
            });
          });
        }

        // Tính tổng từ dữ liệu đã parse
        let totalTickets = ticketTypesStats.reduce((sum, t) => sum + t.totalQuantity, 0);
        let soldTickets = ticketTypesStats.reduce((sum, t) => sum + t.soldQuantity, 0);
        let totalRevenue = ticketTypesStats.reduce((sum, t) => sum + (t.soldQuantity * t.price), 0);

        this.ticketStats = {
          totalTickets,
          soldTickets,
          remainingTickets: totalTickets - soldTickets,
          totalRevenue,
          ticketTypes: ticketTypesStats
        };

        console.log('Parsed ticket stats:', this.ticketStats); // Debug log
        this.isLoadingStats = false;
      },
      error: err => {
        console.error('Lỗi khi tải thống kê vé:', err);
        this.isLoadingStats = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  downloadPdfReport(): void {
    this.downloadReport('pdf');
  }

  downloadExcelReport(): void {
    this.downloadReport('excel');
  }

  private downloadReport(type: 'pdf' | 'excel'): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không tìm thấy token!');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const mimeType =
      type === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExt = type === 'pdf' ? 'pdf' : 'xlsx';

    if (type === 'pdf') this.isDownloadingPdf = true;
    if (type === 'excel') this.isDownloadingExcel = true;

    this.http
      .get(`http://localhost:8080/api/events/${this.eventId}/report/${type}`, {
        headers,
        responseType: 'blob'
      })
      .subscribe({
        next: data => {
          const blob = new Blob([data], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `event_report_${this.eventId}.${fileExt}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          if (type === 'pdf') this.isDownloadingPdf = false;
          if (type === 'excel') this.isDownloadingExcel = false;
        },
        error: err => {
          console.error(`Lỗi khi tải báo cáo ${type.toUpperCase()}:`, err);
          if (type === 'pdf') this.isDownloadingPdf = false;
          if (type === 'excel') this.isDownloadingExcel = false;
        }
      });
  }
}