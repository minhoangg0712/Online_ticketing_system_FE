import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.css'
})
export class UpcomingComponent {
  @Input() events: any[] = [];

  get upcomingEvents() {
  const now = new Date();
  return this.events?.filter(event => new Date(event.startTime) > now) ?? []; 
}

}
