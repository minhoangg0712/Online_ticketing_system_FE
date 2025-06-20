import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// Update the import path below if admin.service.ts is in a different directory
import { AdminService } from '../service/admin.service'; // Import AdminService
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(private adminService: AdminService) {} // Inject AdminService

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data.listUsers ?? []; // Dùng fallback nếu response rỗng
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    });
  }
}
