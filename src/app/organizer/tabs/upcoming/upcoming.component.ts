import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTranslatePipe } from '../../../status-translate.pipe';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [CommonModule, StatusTranslatePipe],
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
