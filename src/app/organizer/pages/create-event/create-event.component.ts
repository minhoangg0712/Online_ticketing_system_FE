import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from '../../tabs-create-event/info/info.component';
import { DateComponent } from '../../tabs-create-event/date/date.component';
import { PayComponent } from '../../tabs-create-event/pay/pay.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, InfoComponent, DateComponent, PayComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  @ViewChild(InfoComponent) infoComponent!: InfoComponent;
  @ViewChild(DateComponent) dateComponent!: DateComponent;
  @ViewChild(PayComponent) payComponent!: PayComponent;

  currentStep = 1;
  maxStep = 3;

  infoData: any = {};
  dateData: any = {};
  payData: any = {};

  goToStep(step: number) {
    if (step >= 1 && step <= this.maxStep) {
      this.currentStep = step;
    }
  }

  nextStep() {
    if (this.currentStep < this.maxStep) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onInfoChange(data: any) {
    this.infoData = data;
  }

  onDateChange(data: any) {
    this.dateData = data;
  }

  // Nếu có payData thì làm tương tự
  // onPayChange(data: any) { this.payData = data; }

  submitAll() {
    // Gom dữ liệu lại
    const payload = {
      ...this.infoData,
      ...this.dateData
      // ...this.payData
    };
    // TODO: Gọi API gửi payload lên BE
    console.log('Tạo sự kiện với dữ liệu:', payload);
    // Có thể gọi service ở đây
  }
} 