import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from "../../tabs-create-event/info/info.component";
import { DateComponent } from '../../tabs-create-event/date/date.component';
import { PayComponent } from '../../tabs-create-event/pay/pay.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    DateComponent,
    PayComponent
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  selectedTab: string = 'info';

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  onContinue() {
    if (this.selectedTab === 'info') {
      this.selectedTab = 'date';
    } else if (this.selectedTab === 'date') {
      this.selectedTab = 'pay';
    }
  }
}
