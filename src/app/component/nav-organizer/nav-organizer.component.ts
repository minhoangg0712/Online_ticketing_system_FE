import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-organizer',
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './nav-organizer.component.html',
  styleUrl: './nav-organizer.component.css'
})
export class NavOrganizerComponent {
  currentRoute: string = '';
  isLoggedIn: boolean = false;
  isLogoutModalOpen: boolean = false;
  notificationCount: number = 2; // Example notification count
  currentDate: Date = new Date();

  constructor(private router: Router) { }

  goToEvents(): void {
    this.router.navigate(['/organizer/events']);
  }
  
  goToExportFile(): void {
    this.router.navigate(['/organizer/export-file']);
  }
  
  goToLegalDocument(): void {
    this.router.navigate(['/organizer/legal-document']);
  }
}
