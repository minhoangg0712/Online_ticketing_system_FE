import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpcomingComponent } from '../../tabs/upcoming/upcoming.component';
import { PastComponent } from '../../tabs/past/past.component';
import { PendingComponent } from '../../tabs/pending/pending.component';
import { DraftComponent } from '../../tabs/draft/draft.component';

@Component({
  selector: 'app-home-organizer',
  imports: [
    RouterModule,
    CommonModule,
    UpcomingComponent,
    PastComponent,
    PendingComponent,
    DraftComponent,
  ],
  templateUrl: './home-organizer.component.html',
  styleUrl: './home-organizer.component.css'
})
export class HomeOrganizerComponent {

  selectedTab: string = 'upcoming';

  setTab(tab: string) {
    this.selectedTab = tab;
  }
}
