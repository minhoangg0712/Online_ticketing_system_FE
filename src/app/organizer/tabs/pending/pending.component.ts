import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {
  @Input() events: any[] = [];

  get pendingEvents() {
  return this.events?.filter(event => event.approvalStatus === 'pending') || [];
  }
}
