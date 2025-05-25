import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateEventComponent } from '../../organizer/pages/create-event/create-event.component';
import { HomeOrganizerComponent } from "../../organizer/pages/home-organizer/home-organizer.component";

@Component({
  selector: 'app-nav-organizer',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    CreateEventComponent,
    HomeOrganizerComponent
],
  templateUrl: './nav-organizer.component.html',
  styleUrls: ['./nav-organizer.component.css']
})
export class NavOrganizerComponent implements OnInit {
  currentRoute: string = '';
  isLoggedIn: boolean = false;
  isLogoutModalOpen: boolean = false;
  notificationCount: number = 2;
  currentDate: Date = new Date();
  selectedTab: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  setTab(tab: string) {
    this.selectedTab = tab;
  }

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
