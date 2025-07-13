import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingEventComponent } from '../../slides/trending-event/trending-event.component';
import { ForyouEventComponent } from '../../slides/foryou-event/foryou-event.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TimelineEventComponent } from "../../slides/EventTimeline/timeline-event/timeline-event.component";
import { LivemusicEventComponent } from "../../slides/livemusic-event/livemusic-event.component";
import { StageArtEventComponent } from "../../slides/stage-art-event/stage-art-event.component";
import { InterestPlaceComponent } from "../../slides/interest-place/interest-place.component";
import { SpecialEventComponent } from '../../slides/special-event/special-event.component';
import { EventsService } from '../../services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule, TrendingEventComponent, ForyouEventComponent, HttpClientModule, TimelineEventComponent, LivemusicEventComponent, StageArtEventComponent, InterestPlaceComponent, SpecialEventComponent],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit {
  events: any[] = [];
  currentIndex = 0;
  transitionStyle = 'transform 0.5s ease-in-out';
  

  constructor(private http: HttpClient, private eventService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.loadHotTrendingEvents()
  }


  loadHotTrendingEvents() {
    this.eventService.getRecommendedEvents('hot-trending').subscribe(res => {
      this.events = res?.data?.listEvents || [];

      this.events = this.events.map((event: any) => ({
        id: event.eventId,
        backgroundUrl: event.backgroundUrl
      }));
    });
  }

  get visibleImages() {
    const total = this.events.length;

    if (total === 0) return [];

    const first = this.currentIndex % total;
    const second = (this.currentIndex + 1) % total;

    return [
      this.events[first],
      this.events.length > 1 ? this.events[second] : null
    ].filter(Boolean);
  }

  get dotIndicators(): number[] {
    return Array(this.events.length).fill(0);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.events.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.events.length) % this.events.length;
  }

  // detail-ticket.component.ts hoặc component list event
  goToEventDetail(eventId: number) {
    // Lưu đường dẫn vào sessionStorage
    sessionStorage.setItem('redirectAfterLogin', `/detail-ticket/${eventId}`);
    this.router.navigate([`/detail-ticket/${eventId}`]);
  }

}
