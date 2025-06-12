import { Component, OnInit } from '@angular/core';
import { NavUserComponent } from '../../../component/nav-user/nav-user.component';
import { CommonModule } from '@angular/common';
import { AllComponent } from '../tabs/all/all.component';
import { CancelComponent } from '../tabs/cancel/cancel.component';
import { ProcessingComponent } from '../tabs/processing/processing.component';
import { SuccessComponent } from '../tabs/success/success.component';

@Component({
  selector: 'app-purchased-ticket',
  imports: [ NavUserComponent, CommonModule, AllComponent, CancelComponent, ProcessingComponent, SuccessComponent ],
  templateUrl: './purchased-ticket.component.html',
  styleUrl: './purchased-ticket.component.css'
})
export class PurchasedTicketComponent implements OnInit {
  selectedTab: string = 'all';

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  constructor() { }

  ngOnInit(): void {}
}
