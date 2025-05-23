import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {
  constructor(private router: Router) {}

  goToOrganizer(): void {
    // Navigate to the organizer page
    this.router.navigate(['/organizer']);
  }
}
