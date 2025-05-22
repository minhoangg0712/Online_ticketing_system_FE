import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-organizer',
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './home-organizer.component.html',
  styleUrl: './home-organizer.component.css'
})
export class HomeOrganizerComponent {

  createNewEvent(): void{
    console.log('Create New Event clicked');
  }
}
