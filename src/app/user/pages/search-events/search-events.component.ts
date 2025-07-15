import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';

@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastNotificationComponent],
  templateUrl: './search-events.component.html',
  styleUrl: './search-events.component.css'
})
export class SearchEventsComponent implements OnInit {
  @ViewChild('notification') notification!: ToastNotificationComponent;
  events: any[] = [];
  showFilter = false;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  showNotification = false;

  locations = ['Toàn quốc', 'Hồ Chí Minh', 'Hà Nội', 'Đà Lạt', 'Vị trí khác'];
  selectedLocation = 'Toàn quốc';
  categories = ['Nhạc sống', 'Sân khấu & Nghệ thuật', 'Thể Thao', 'Khác'];
  selectedCategories: string[] = [];

  queryParams: any = {};

  constructor(private eventsService: EventsService, private route: ActivatedRoute,
  private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryParams = {
        category: params['category'] || '',
        address: params['address'] || '',
        startTime: params['startTime'] || '',
        endTime: params['endTime'] || '',
        name: params['name'] || '',
        page: params['page'] ? + params['page'] : 1
      };

      this.currentPage = 1;
      this.events = [];
      this.loadEvents();
    });
  }

  loadEvents() {
    if (this.isLoading || (this.currentPage > this.totalPages)) return;

    this.isLoading = true;

    const paramsWithPage = { ...this.queryParams, page: this.currentPage };

    this.eventsService.searchEvents(paramsWithPage).subscribe({
      next: (response) => {
        const newEvents = response?.data?.listEvents || [];
        this.totalPages = response?.data?.totalPages || 1;

        this.events = [...this.events, ...newEvents];
        this.isLoading = false;
      },
      error: () => {
        console.error('Lỗi khi gọi API');
        this.isLoading = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !this.isLoading &&
      this.currentPage < this.totalPages
    ) {
      this.currentPage++;
      this.loadEvents();
    }
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);

    if (index === -1) {
      if (this.selectedCategories.length >= 1) {
        this.notification.showNotification('Chỉ được chọn tối đa 1 thể loại !', 3000, 'warning');
        return;
      }
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  resetFilter() {
    this.selectedLocation = 'Toàn quốc';
    this.selectedCategories = [];
  }

  removeLocationFilter() {
    this.selectedLocation = 'Toàn quốc';
    this.applyFilter();
  }

  removeCategory(category: string) {
    this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    this.applyFilter();
  }

  applyFilter() {
    let addressParam: string | undefined;
    let categoryParam: string | undefined;

    if (this.selectedLocation === 'Toàn quốc') {
      addressParam = undefined;
    } else if (this.selectedLocation === 'Vị trí khác') {
      addressParam = 'Khác';
    } else {
      addressParam = this.selectedLocation;
    }

    const categoryMap: { [key: string]: string } = {
      'Nhạc sống': 'Music',
      'Sân khấu & Nghệ thuật': 'Theatre-Arts',
      'Thể Thao': 'Sport',
      'Khác': 'Other'
    };

    if (this.selectedCategories.length === 1) {
      categoryParam = categoryMap[this.selectedCategories[0]];
    } else {
      categoryParam = undefined;
    }

    // 👉 Điều hướng đến route hiện tại kèm query mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        address: addressParam || null,
        category: categoryParam || null,
      }
    });

    // Ẩn popup
    this.showFilter = false;
  }

  goToEventDetail(eventId: number) {
    this.router.navigate([`/detail-ticket/${eventId}`]);
  }

  onNotificationClose() {}
}
