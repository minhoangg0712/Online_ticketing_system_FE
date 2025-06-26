import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userCount: number = 0;
  isLoading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    this.loadUserCount();
  }

  loadUserCount(): void {
    console.log('Starting to load user count...');

    this.adminService.getUserCount().subscribe({
      next: (count) => {
        console.log('Received count from service:', count);
        console.log('Count type:', typeof count);
        this.userCount = count;
        this.isLoading = false;
        console.log('Final userCount set to:', this.userCount);
      },
      error: (error) => {
        console.error('Error loading user count:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        this.isLoading = false;
      }
    });
  }
}
