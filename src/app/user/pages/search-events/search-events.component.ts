import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-events.component.html',
  styleUrl: './search-events.component.css'
})
export class SearchEventsComponent implements OnInit {
  events: any[] = [];
  showFilter = false;

  locations = ['Toàn quốc', 'Hồ Chí Minh', 'Hà Nội', 'Đà Lạt', 'Vị trí khác'];
  selectedLocation = 'Toàn quốc';
  categories = ['Nhạc sống', 'Sân khấu & Nghệ thuật', 'Thể Thao', 'Khác'];
  selectedCategories: string[] = [];

  constructor(private eventsService: EventsService, private route: ActivatedRoute) {}

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
      const category = params['category'] || '';
      const address = params['address'] || '';
      const startTime = params['startTime'] || '';
      const endTime = params['endTime'] || '';
      const name = params['name'] || '';

      this.fetchEvents({ category, address, startTime, endTime, name });
    });
  }

  fetchEvents(params: { category?: string; address?: string; startTime?: string; endTime?: string; name?: string }) {
    this.eventsService.searchEvents(params).subscribe({
      next: (response) => {
        if (response?.data?.listEvents) {
          this.events = response.data.listEvents;
        } else {
          this.events = [];
        }
      },
      error: (error) => {
        console.error('Lỗi khi gọi API:', error);
        this.events = [];
      }
    });
  }
  
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  resetFilter() {
    this.selectedLocation = 'Toàn quốc';
    this.selectedCategories = [];
  }

  applyFilter() {
    console.log({
      location: this.selectedLocation,
      categories: this.selectedCategories
    });
  }
}
