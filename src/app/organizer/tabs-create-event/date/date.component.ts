import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './date.component.html',
  styleUrl: './date.component.css'
})
export class DateComponent {
  ticketForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ticketForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      ticketDate: ['', Validators.required],
    });
  }

  get timeInvalid(): boolean {
    const start = new Date(this.ticketForm.value.startTime);
    const end = new Date(this.ticketForm.value.endTime);
    const ticketDate = new Date(this.ticketForm.value.ticketDate);
    return this.ticketForm.valid && end <= start;
  }
}
