import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // ✅ Import thêm HttpClientModule
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any>('http://localhost:8080/api/users').subscribe({
      next: (response) => {
        this.users = response.data.listUsers ?? []; // ✅ Dùng fallback nếu response rỗng
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    });
  }
}
