import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './date.component.html',
  styleUrl: './date.component.css'
})
export class DateComponent {
  ticketForm: FormGroup;
  @Output() formChange = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.ticketForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      eventEndDate: ['', Validators.required],
      eventEndTime: ['', Validators.required],
      tickets: this.fb.array([this.createTicketGroup()])
    });
  }

  // Tạo form group cho từng loại vé
  createTicketGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: [1, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // Getter tiện lợi
  get tickets(): FormArray {
    return this.ticketForm.get('tickets') as FormArray;
  }

  get isEndTimeAfterStart(): boolean {
    const formValue = this.ticketForm.value;
    if (!formValue.startDate || !formValue.startTime || !formValue.endDate || !formValue.endTime) return true;

    const start = new Date(`${formValue.startDate}T${formValue.startTime}`);
    const end = new Date(`${formValue.endDate}T${formValue.endTime}`);
    return end > start;
  }

  get isEventEndTimeAfterStart(): boolean {
    const formValue = this.ticketForm.value;
    if (!formValue.eventDate || !formValue.eventTime || !formValue.eventEndDate || !formValue.eventEndTime) {
      return true;
    }
    const start = new Date(`${formValue.eventDate}T${formValue.eventTime}`);
    const end = new Date(`${formValue.eventEndDate}T${formValue.eventEndTime}`);
    return end > start;
  }

  get isEventDateValid(): boolean {
    const formValue = this.ticketForm.value;
    if (!formValue.startDate || !formValue.eventDate) return true;

    const start = new Date(formValue.startDate);
    const event = new Date(formValue.eventDate);
    return event >= start;
  }

  get isFormValid(): boolean {
    return this.ticketForm.valid && this.isEndTimeAfterStart && this.isEventDateValid && this.isEventEndTimeAfterStart;
  }

  // Emit dữ liệu mỗi khi form thay đổi
  emitFormChange() {
    this.formChange.emit(this.ticketForm.value);
  }

  // Gọi emitFormChange ở các chỗ thay đổi dữ liệu
  addTicket(): void {
    this.tickets.push(this.createTicketGroup());
    this.emitFormChange();
  }

  removeTicket(index: number): void {
    if (this.tickets.length > 1) {
      this.tickets.removeAt(index);
      this.emitFormChange();
    }
  }

  getCharCount(value: string): number {
    return value ? value.length : 0;
  }

  onSubmit(): void {
    if (this.isFormValid) {
      const formValue = this.ticketForm.value;

      const payload = {
        startTime: `${formValue.eventDate}T${formValue.eventTime}:00`,
        endTime: `${formValue.eventEndDate}T${formValue.eventEndTime}:00`,
        saleStart: `${formValue.startDate}T${formValue.startTime}:00`,
        saleEnd: `${formValue.endDate}T${formValue.endTime}:00`,
        tickets: formValue.tickets.map((ticket: any) => ({
          ticketType: ticket.name,
          quantityTotal: ticket.quantity,
          price: ticket.price
        }))
      };

      console.log('Form submitted with API payload:', payload);
      // Logic để gửi payload đi sẽ được thêm ở đây
      this.emitFormChange();
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.ticketForm.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        (control as any).markAllAsTouched();
      } else {
        control.markAsTouched();
      }
    });
  }
}
