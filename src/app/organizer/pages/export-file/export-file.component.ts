import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface EventItem {
  eventId: number;
  eventName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  logoUrl: string;
  startTime: string;
  endTime: string;
  updateAt: string;
  addressName?: string;
  category?: string;
  description?: string;
}

@Component({
  selector: 'app-export-file',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './export-file.component.html',
  styleUrl: './export-file.component.css'
})
export class ExportFileComponent implements OnInit {
  events: EventItem[] = [];
  filteredEvents: EventItem[] = [];
  selectedEvent: EventItem | null = null;
  isLoadingList = false;
  startDate: string = '';
  endDate: string = '';
  showFilter = false;
  searchTerm: string = '';

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pagedEvents: EventItem[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchEvents(token);
  }

  fetchEvents(token: string): void {
    this.isLoadingList = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://113.20.107.77:8080/api/events/by-organizer', { headers })
      .subscribe({
        next: (res) => {
          // Chỉ lấy sự kiện có status là 'upcoming' hoặc 'completed'
          this.events = (res.data?.listEvents || []).filter((event: EventItem) =>
            event.status === 'upcoming' || event.status === 'completed'
          );
          this.filterEvents();
          this.isLoadingList = false;
        },
        error: () => {
          this.isLoadingList = false;
        }
      });
  }

  filterEvents() {
    if (!this.startDate && !this.endDate) {
      this.filteredEvents = [...this.events];
    } else {
      const start = this.startDate ? new Date(this.startDate).getTime() : -Infinity;
      const end = this.endDate ? new Date(this.endDate).getTime() : Infinity;
      this.filteredEvents = this.events.filter((event: EventItem) => {
        const eventTime = new Date(event.startTime).getTime();
        return eventTime >= start && eventTime <= end;
      });
    }
    this.showFilter = false;
    this.currentPage = 1;
    this.updatePagedEvents();
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = [...this.events];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredEvents = this.events.filter((event: EventItem) => {
        const nameMatch = event.eventName?.toLowerCase().includes(searchLower);
        const venueMatch = event.addressName?.toLowerCase().includes(searchLower);
        const categoryMatch = event.category?.toLowerCase().includes(searchLower);
        const descriptionMatch = event.description?.toLowerCase().includes(searchLower);
        return nameMatch || venueMatch || categoryMatch || descriptionMatch;
      });
    }
    this.currentPage = 1;
    this.updatePagedEvents();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEvents = [...this.events];
    this.currentPage = 1;
    this.updatePagedEvents();
  }

  updatePagedEvents(): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    this.pagedEvents = this.filteredEvents.slice(startIdx, endIdx);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedEvents();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedEvents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedEvents();
    }
  }

  openDetail(event: EventItem): void {
    this.selectedEvent = event;
  }

  closeDetail(): void {
    this.selectedEvent = null;
  }

  ngDoCheck(): void {
    this.updatePagedEvents();
  }
}
