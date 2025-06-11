import { Component } from '@angular/core';
import { NavUserComponent } from '../../../component/nav-user/nav-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchased-ticket',
  imports: [ NavUserComponent, CommonModule ],
  templateUrl: './purchased-ticket.component.html',
  styleUrl: './purchased-ticket.component.css'
})
export class PurchasedTicketComponent {
  selectedTab: string = 'all';

  setTab(tab: string) {
    this.selectedTab = tab;
  }
}
