import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from '../../tabs-create-event/info/info.component';
import { DateComponent } from '../../tabs-create-event/date/date.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, InfoComponent, DateComponent,],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  @ViewChild(InfoComponent) infoComponent!: InfoComponent;
  @ViewChild(DateComponent) dateComponent!: DateComponent;

  currentStep = 1;
  maxStep = 2;

  infoData: any = {};
  dateData: any = {};

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

  submitAll() {
    const payload = {
      ...this.infoData,
      ...this.dateData
    };
    console.log('Tạo sự kiện với dữ liệu:', payload);
  }
} 