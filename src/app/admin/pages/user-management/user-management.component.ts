import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isDeleting: boolean = false; // Để hiển thị loading khi đang xóa
  showSuccessModal: boolean = false; // Để hiển thị modal thành công
  showErrorModal: boolean = false; // Để hiển thị modal lỗi
  showConfirmModal: boolean = false; // Để hiển thị modal xác nhận
  modalMessage: string = ''; // Nội dung message trong modal

  // Thông tin để xác nhận xóa
  userToDelete: { id: number, name: string } | null = null;
  usersToDelete: number[] = []; // Cho xóa nhiều user

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data.listUsers ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    });
  }

  // Hiển thị modal xác nhận xóa người dùng
  confirmDeleteUser(userId: number, userName: string): void {
    this.userToDelete = { id: userId, name: userName };
    this.usersToDelete = []; // Reset xóa nhiều
    this.showConfirmModal = true;
  }

  // Hiển thị modal xác nhận xóa nhiều người dùng
  confirmDeleteMultipleUsers(userIds: number[]): void {
    this.usersToDelete = userIds;
    this.userToDelete = null; // Reset xóa đơn
    this.showConfirmModal = true;
  }

  // Xác nhận xóa người dùng
  proceedWithDelete(): void {
    this.showConfirmModal = false;

    if (this.userToDelete) {
      // Xóa 1 người dùng
      this.executeDeleteUser(this.userToDelete.id, this.userToDelete.name);
    } else if (this.usersToDelete.length > 0) {
      // Xóa nhiều người dùng
      this.executeDeleteMultipleUsers(this.usersToDelete);
    }
  }

  // Thực hiện xóa người dùng
  private executeDeleteUser(userId: number, userName: string): void {
    this.isDeleting = true;

    this.adminService.deleteUser(userId).subscribe({
      next: (response) => {
        console.log('Xóa người dùng thành công:', response);

        // Hiển thị modal thành công
        this.modalMessage = `Xóa người dùng "${userName}" thành công!`;
        this.showSuccessModal = true;

        // Tải lại danh sách người dùng
        this.loadUsers();

        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error);

        // Hiển thị modal lỗi
        this.modalMessage = 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;

        this.isDeleting = false;
      }
    });
  }

  // Thực hiện xóa nhiều người dùng
  private executeDeleteMultipleUsers(userIds: number[]): void {
    this.isDeleting = true;

    this.adminService.deleteUsers(userIds).subscribe({
      next: (response) => {
        console.log('Xóa người dùng thành công:', response);

        // Hiển thị modal thành công
        this.modalMessage = `Xóa ${userIds.length} người dùng thành công!`;
        this.showSuccessModal = true;

        this.loadUsers();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error);

        // Hiển thị modal lỗi
        this.modalMessage = 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;

        this.isDeleting = false;
      }
    });
  }

  // Hủy xác nhận xóa
  cancelDelete(): void {
    this.showConfirmModal = false;
    this.userToDelete = null;
    this.usersToDelete = [];
  }

  // Đóng modal thành công
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.modalMessage = '';
  }

  // Đóng modal lỗi
  closeErrorModal(): void {
    this.showErrorModal = false;
    this.modalMessage = '';
  }
}
