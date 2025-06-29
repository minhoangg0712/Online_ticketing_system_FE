import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { StatusTranslatePipe } from '../../../status-translate.pipe';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, StatusTranslatePipe],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {
  @Input() events: any[] = [];

  get pendingEvents() {
  return this.events?.filter(event => event.approvalStatus === 'pending') || [];
  }
}
