import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Ticket {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-date',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './date.component.html',
  styleUrl: './date.component.css'
})
export class DateComponent {
  ticketForm: FormGroup;
  tickets: Ticket[] = [
    { name: '', price: 0, quantity: 1 }
  ];

  constructor(private fb: FormBuilder) {
    this.ticketForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required]
    });
  }

  // Validate that end date/time is after start date/time
  get isEndTimeAfterStart(): boolean {
    const formValue = this.ticketForm.value;
    if (!formValue.startDate || !formValue.startTime || !formValue.endDate || !formValue.endTime) {
      return true; // Don't show error if fields are empty
    }
    
    const startDateTime = new Date(`${formValue.startDate}T${formValue.startTime}`);
    const endDateTime = new Date(`${formValue.endDate}T${formValue.endTime}`);
    
    return endDateTime > startDateTime;
  }

  // Validate that event date is after or equal to start date
  get isEventDateValid(): boolean {
    const formValue = this.ticketForm.value;
    if (!formValue.startDate || !formValue.eventDate) {
      return true;
    }
    
    const startDate = new Date(formValue.startDate);
    const eventDate = new Date(formValue.eventDate);
    
    return eventDate >= startDate;
  }

  // Validate that all tickets have required fields
  get areTicketsValid(): boolean {
    return this.tickets.every(ticket => 
      ticket.name.trim() !== '' && 
      ticket.price > 0 && 
      ticket.quantity > 0
    );
  }

  // Overall form validity
  get isFormValid(): boolean {
    return this.ticketForm.valid && 
           this.isEndTimeAfterStart && 
           this.isEventDateValid && 
           this.areTicketsValid;
  }

  addTicket(): void {
    this.tickets.push({ name: '', price: 0, quantity: 1 });
  }

  removeTicket(index: number): void {
    if (this.tickets.length > 1) {
      this.tickets.splice(index, 1);
    }
  }

  // Get character count for ticket name
  getCharCount(ticketName: string): number {
    return ticketName ? ticketName.length : 0;
  }

  // Submit form
  onSubmit(): void {
    if (this.isFormValid) {
      const formData = {
        ...this.ticketForm.value,
        tickets: this.tickets
      };
      console.log('Form submitted:', formData);
      // Handle form submission here
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  // Mark all fields as touched to show validation errors
  private markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach(key => {
      this.ticketForm.get(key)?.markAsTouched();
    });
  }
}