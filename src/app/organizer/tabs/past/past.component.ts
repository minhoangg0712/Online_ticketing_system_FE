import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-past',
  imports: [CommonModule],
  templateUrl: './past.component.html',
  styleUrl: './past.component.css'
})
export class PastComponent {
  @Input() events: any[] = [];

  get pastEvents() {
    const now = new Date();
    return this.events?.filter(event => new Date(event.endTime) < now) || [];
  }
}
