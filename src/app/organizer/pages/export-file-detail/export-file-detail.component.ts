import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ListEventsService } from '../../services/list-events.service';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface EventData {
  id: number;
  eventName: string;
  startTime: string;
  endTime: string;
  address: string;
  category: string;
  description: string;
}

interface TicketTypeStats {
  ticketType: string;
  totalQuantity: number;
  soldQuantity: number;
  remainingQuantity: number;
  price: number;
  revenue: number;
}

interface TicketStats {
  totalTickets: number;
  soldTickets: number;
  remainingTickets: number;
  totalRevenue: number;
  ticketTypes: TicketTypeStats[];
}

interface TicketsPerDay {
  date: string;
  totalTicketSold?: number; // API tổng
  totalQuantity?: number;   // API lọc theo loại vé
  ticketType?: string;
}

@Component({
  selector: 'app-export-file-detail',
  templateUrl: './export-file-detail.component.html',
  styleUrls: ['./export-file-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class ExportFileDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  pieChart: Chart | null = null;

  @ViewChild('ticketsPerDayChartCanvas', { static: false }) ticketsPerDayChartCanvas!: ElementRef<HTMLCanvasElement>;
  ticketsPerDayChart: Chart | null = null;

  eventId!: number;
  eventData: EventData | null = null;

  ticketStats: TicketStats = {
    totalTickets: 0,
    soldTickets: 0,
    remainingTickets: 0,
    totalRevenue: 0,
    ticketTypes: []
  };

  ticketsPerDay: TicketsPerDay[] = [];
  selectedTicketType: string = '';

  isLoading = true;
  isLoadingStats = true;
  isLoadingTicketsPerDay = true;

  isDownloadingPdf = false;
  isDownloadingExcel = false;
  isDownloadingBuyerPdf = false;
  isDownloadingBuyerExcel = false;

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
    this.loadTicketsPerDay();
  }

  ngAfterViewInit(): void {
    if (!this.isLoadingStats && this.ticketStats.ticketTypes.length > 0) {
      this.renderPieChart();
    }
    if (!this.isLoadingTicketsPerDay && this.ticketsPerDay.length > 0) {
      this.renderTicketsPerDayChart();
    }
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
        const ticketTypesStats: TicketTypeStats[] = [];

        if (data.ticketTypes && data.ticketPrices && data.ticketsTotal && data.ticketsSold) {
          Object.keys(data.ticketTypes).forEach(key => {
            const ticketType = data.ticketTypes[key];
            const price = data.ticketPrices[ticketType] || 0;
            const totalQuantity = data.ticketsTotal[ticketType] || 0;
            const soldQuantity = data.ticketsSold[ticketType] || 0;
            
            ticketTypesStats.push({
              ticketType: ticketType,
              totalQuantity,
              soldQuantity,
              remainingQuantity: totalQuantity - soldQuantity,
              price,
              revenue: soldQuantity * price
            });
          });
        }

        const totalTickets = ticketTypesStats.reduce((sum, t) => sum + t.totalQuantity, 0);
        const soldTickets = ticketTypesStats.reduce((sum, t) => sum + t.soldQuantity, 0);
        const totalRevenue = ticketTypesStats.reduce((sum, t) => sum + t.revenue, 0);

        this.ticketStats = {
          totalTickets,
          soldTickets,
          remainingTickets: totalTickets - soldTickets,
          totalRevenue,
          ticketTypes: ticketTypesStats
        };

        this.isLoadingStats = false;
        setTimeout(() => this.renderPieChart(), 0);
      },
      error: err => {
        console.error('Lỗi khi tải thống kê vé:', err);
        this.isLoadingStats = false;
      }
    });
  }

private loadTicketsPerDay(ticketType?: string): void {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Không tìm thấy token!');
    this.isLoadingTicketsPerDay = false;
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  // Nếu chọn tất cả loại vé, lấy dữ liệu cho từng loại và tổng hợp
  if (!ticketType) {
    // Tất cả loại vé
    this.isLoadingTicketsPerDay = true;
    const types = this.ticketStats.ticketTypes.map(t => t.ticketType);
    const requests = types.map(type =>
      this.http.get<{ data: TicketsPerDay[] }>(
        `http://localhost:8080/api/events/report/ticket-type-per-day/${this.eventId}?ticketType=${encodeURIComponent(type)}`,
        { headers }
      )
    );
    Promise.all(requests.map(req => req.toPromise()))
      .then(responses => {
        // Tổng hợp dữ liệu: mỗi loại vé là một mảng dữ liệu riêng
        const allData: { [type: string]: TicketsPerDay[] } = {};
        responses.forEach((res, idx) => {
          const type = types[idx];
          allData[type] = (res?.data || []).map(item => ({
            date: item.date,
            totalQuantity: item.totalQuantity || 0,
            ticketType: type
          }));
        });
        // Lưu lại để vẽ nhiều đường line
        this.ticketsPerDay = [];
        (window as any).ticketsPerDayAllTypes = allData; // lưu tạm để vẽ
        this.isLoadingTicketsPerDay = false;
        setTimeout(() => this.renderTicketsPerDayChart(), 0);
      })
      .catch(err => {
        console.error('Lỗi khi tải vé bán theo ngày:', err);
        this.isLoadingTicketsPerDay = false;
      });
  } else {
    // Chỉ một loại vé
    const url = `http://localhost:8080/api/events/report/ticket-type-per-day/${this.eventId}?ticketType=${encodeURIComponent(ticketType)}`;
    this.http.get<{ data: TicketsPerDay[] }>(url, { headers })
      .subscribe({
        next: res => {
          let rawData = res.data || [];
          this.ticketsPerDay = rawData.map(item => ({
            date: item.date,
            totalQuantity: item.totalQuantity || 0,
            ticketType: item.ticketType
          }));
          (window as any).ticketsPerDayAllTypes = undefined;
          this.isLoadingTicketsPerDay = false;
          setTimeout(() => this.renderTicketsPerDayChart(), 0);
        },
        error: err => {
          console.error('Lỗi khi tải vé bán theo ngày:', err);
          this.isLoadingTicketsPerDay = false;
        }
      });
  }
}

  onTicketTypeChange(event: any): void {
    this.selectedTicketType = event.target.value;
    this.loadTicketsPerDay(this.selectedTicketType);
  }

  renderPieChart(): void {
  if (!this.pieChartCanvas) return;
  const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
  if (!ctx) return;

  if (this.pieChart) {
    this.pieChart.destroy();
  }

  const labels = this.ticketStats.ticketTypes.map(t => t.ticketType);
  const data = this.ticketStats.ticketTypes.map(t => t.soldQuantity);
  const backgroundColors = [
    '#ff7e42', '#3498db', '#2ecc71', '#e74c3c',
    '#9b59b6', '#f1c40f', '#1abc9c', '#34495e'
  ];
  const total = data.reduce((a, b) => a + b, 0);

  this.pieChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Số vé đã bán',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderRadius: 6,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const value = context.parsed.y;
              return `${context.label}: ${value} vé`;
            }
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'start',
          color: '#ffffffff',
          font: {
            weight: 'bold',
            size: 13
          },
          formatter: function(value: number, context: any) {
            const dataset = context.chart.data.datasets[0].data;
            const totalSold = dataset.reduce((a: number, b: number) => a + b, 0);
            const percent = totalSold ? ((value / totalSold) * 100).toFixed(1) : 0;
            return `${percent}%`;
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#444'
          }
        },
        y: {
          beginAtZero: true,
          max: data.reduce((a, b) => a + b, 0),
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#444'
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
  }

  private renderTicketsPerDayChart(): void {
  if (!this.ticketsPerDayChartCanvas) return;
  const ctx = this.ticketsPerDayChartCanvas.nativeElement.getContext('2d');
  if (!ctx) return;

  if (this.ticketsPerDayChart) this.ticketsPerDayChart.destroy();

  const colorList = ['#36A2EB', '#4BC0C0', '#FF6384', '#FFCE56', '#9966FF', '#FF9F40', '#ff7e42', '#3498db'];

  // Nếu chọn tất cả loại vé, vẽ nhiều đường line
  const allTypesData = (window as any).ticketsPerDayAllTypes;
  if (allTypesData) {
    // Lấy tất cả ngày xuất hiện trong các loại vé
    const allDatesSet = new Set<string>();
    (Object.values(allTypesData) as TicketsPerDay[][]).forEach((arr) => {
      arr.forEach((t: TicketsPerDay) => allDatesSet.add(t.date));
    });
    const labels = Array.from(allDatesSet).sort();
    const datasets = Object.entries(allTypesData).map(([type, arr], idx) => {
      const arrTyped = arr as TicketsPerDay[];
      // Map data theo labels (ngày), ép kiểu về number
      const data: number[] = labels.map(date => {
        const found = arrTyped.find((t: TicketsPerDay) => t.date === date);
        return typeof found?.totalQuantity === 'number' ? found.totalQuantity : 0;
      });
      return {
        label: type,
        data,
        borderColor: colorList[idx % colorList.length],
        backgroundColor: colorList[idx % colorList.length],
        fill: false,
        tension: 0.2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderColor: colorList[idx % colorList.length],
        pointBorderWidth: 2
      };
    });
    this.ticketsPerDayChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, labels: { color: '#fff' } },
          tooltip: { callbacks: { label: (context) => `${context.parsed.y} vé` } },
          datalabels: {
            align: 'top',
            anchor: 'end',
            color: '#fff',
            font: { weight: 'bold' },
            formatter: (value) => value
          }
        },
        scales: {
          x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
          y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: '#444' } }
        }
      },
      plugins: [ChartDataLabels]
    });
    return;
  }

  // Nếu chỉ chọn một loại vé, vẽ một đường line
  const labels = this.ticketsPerDay.map(t => t.date);
  const data = this.ticketsPerDay.map(t => t.totalQuantity || 0);
  const ticketTypeLabel = this.selectedTicketType || 'Loại vé';

  this.ticketsPerDayChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: ticketTypeLabel,
        data,
        borderColor: colorList[0],
        backgroundColor: colorList[0],
        fill: false,
        tension: 0.2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderColor: colorList[0],
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, labels: { color: '#fff' } },
        tooltip: { callbacks: { label: (context) => `${context.parsed.y} vé` } },
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: '#fff',
          font: { weight: 'bold' },
          formatter: (value) => value
        }
      },
      scales: {
        x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
        y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: '#444' } }
      }
    },
    plugins: [ChartDataLabels]
  });
}


  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  downloadPdfReport(): void { this.downloadReport('pdf'); }
  downloadExcelReport(): void { this.downloadReport('excel'); }

  private downloadReport(type: 'pdf' | 'excel'): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const mimeType = type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExt = type === 'pdf' ? 'pdf' : 'xlsx';
    if (type === 'pdf') this.isDownloadingPdf = true; else this.isDownloadingExcel = true;

    this.http.get(`http://localhost:8080/api/events/${this.eventId}/report/${type}`, {
      headers, responseType: 'blob'
    }).subscribe({
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
        if (type === 'pdf') this.isDownloadingPdf = false; else this.isDownloadingExcel = false;
      },
      error: () => {
        if (type === 'pdf') this.isDownloadingPdf = false; else this.isDownloadingExcel = false;
      }
    });
  }

  downloadBuyerReport(type: 'pdf' | 'excel'): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const mimeType = type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExt = type === 'pdf' ? 'pdf' : 'xlsx';
    if (type === 'pdf') this.isDownloadingBuyerPdf = true; else this.isDownloadingBuyerExcel = true;

    this.http.get(`http://localhost:8080/api/events/${this.eventId}/report/buyer-${type}`, {
      headers, responseType: 'blob'
    }).subscribe({
      next: data => {
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `buyers_event_${this.eventId}.${fileExt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        if (type === 'pdf') this.isDownloadingBuyerPdf = false; else this.isDownloadingBuyerExcel = false;
      },
      error: () => {
        if (type === 'pdf') this.isDownloadingBuyerPdf = false; else this.isDownloadingBuyerExcel = false;
      }
    });
  }
}