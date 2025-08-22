import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foryou-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foryou-event.component.html',
  styleUrls: ['./foryou-event.component.css']
})
export class ForyouEventComponent implements OnInit {
  events: any[] = [];
  visibleItems: any[] = [];
  startIndex: number = 0;
  readonly ITEMS_PER_PAGE = 4;
  recommendations: any[] = [];

  constructor(private eventService: EventsService,private router: Router) {}

  ngOnInit(): void {
    this.loadForYouEvents();
  }

  loadForYouEvents(): void {
    this.eventService.getRecommendations().subscribe({
      next: (res) => {
        this.events = res?.data ?? [];
        this.startIndex = 0;
        this.updateVisibleItems();
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('Error loading recommended events:', err);
        }
      }
    });
  }

  updateVisibleItems() {
    this.visibleItems = this.events.slice(this.startIndex, this.startIndex + this.ITEMS_PER_PAGE);
  }

  scrollLeft() {
    if (this.canScrollLeft) {
      this.startIndex -= this.ITEMS_PER_PAGE;
      this.updateVisibleItems();
    }
  }

  scrollRight() {
    if (this.canScrollRight) {
      this.startIndex += this.ITEMS_PER_PAGE;
      this.updateVisibleItems();
    }
  }

  get canScrollLeft(): boolean {
    return this.startIndex > 0;
  }

  get canScrollRight(): boolean {
    return this.startIndex + this.ITEMS_PER_PAGE < this.events.length;
  }

  goToEventDetail(eventId: number) {
    sessionStorage.setItem('redirectAfterLogin', `/detail-ticket/${eventId}`);
    this.router.navigate(['/detail-ticket', eventId]);
  }
}
