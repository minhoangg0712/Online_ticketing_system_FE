import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ListEventsService } from '../../services/list-events.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-export-file-detail',
  templateUrl: './export-file-detail.component.html',
  styleUrls: ['./export-file-detail.component.css'],
  standalone: true,
  imports: [ CommonModule, RouterModule, HttpClientModule ]
})
export class ExportFileDetailComponent implements OnInit {
  eventId!: number;
  eventData: any;
  ticketStats: any = {};
  isLoading = true;
  isLoadingStats = true;

  constructor(
    private route: ActivatedRoute,
    private listEventsService: ListEventsService,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventData();
    this.loadTicketStatistics();
  }

  goBack(): void {
    this.location.back();
  }

  loadEventData(): void {
    this.listEventsService.getEventById(this.eventId.toString()).subscribe({
      next: (res: any) => {
        this.eventData = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin sự kiện:', err);
        this.isLoading = false;
      }
    });
  }

  loadTicketStatistics(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không tìm thấy token đăng nhập!');
      this.isLoadingStats = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Gọi API để lấy thống kê vé
    this.http.get<any>(`http://localhost:8080/api/events/${this.eventId}/ticket-statistics`, { headers })
      .subscribe({
        next: (res) => {
          this.ticketStats = res.data || {};
          this.isLoadingStats = false;
        },
        error: (err) => {
          console.error('Lỗi khi tải thống kê vé:', err);
          this.isLoadingStats = false;
          // Fallback data nếu API chưa có
          this.ticketStats = this.calculateFallbackStats();
        }
      });
  }

  calculateFallbackStats(): any {
    if (!this.eventData || !this.eventData.tickets) {
      return {
        totalTickets: 0,
        soldTickets: 0,
        remainingTickets: 0,
        totalRevenue: 0,
        ticketTypes: []
      };
    }

    const ticketTypes = this.eventData.tickets.map((ticket: any) => {
      const sold = Math.floor(Math.random() * ticket.quantityTotal); // Mock data
      const remaining = ticket.quantityTotal - sold;
      const revenue = sold * ticket.price;
      
      return {
        ticketType: ticket.ticketType,
        totalQuantity: ticket.quantityTotal,
        soldQuantity: sold,
        remainingQuantity: remaining,
        price: ticket.price,
        revenue: revenue
      };
    });

    const totalTickets = ticketTypes.reduce((sum: number, ticket: any) => sum + ticket.totalQuantity, 0);
    const soldTickets = ticketTypes.reduce((sum: number, ticket: any) => sum + ticket.soldQuantity, 0);
    const totalRevenue = ticketTypes.reduce((sum: number, ticket: any) => sum + ticket.revenue, 0);

    return {
      totalTickets,
      soldTickets,
      remainingTickets: totalTickets - soldTickets,
      totalRevenue,
      ticketTypes
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getSoldPercentage(total: number, sold: number): number {
    if (total === 0) return 0;
    return Math.round((sold / total) * 100);
  }
}
