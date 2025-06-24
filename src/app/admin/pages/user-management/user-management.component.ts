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
  isDisabling: boolean = false; // Để hiển thị loading khi đang vô hiệu hóa
  showSuccessModal: boolean = false; // Để hiển thị modal thành công
  showErrorModal: boolean = false; // Để hiển thị modal lỗi
  showConfirmModal: boolean = false; // Để hiển thị modal xác nhận
  modalMessage: string = ''; // Nội dung message trong modal

  // Thông tin để xác nhận xóa
  userToDelete: { id: number, name: string } | null = null;
  usersToDelete: number[] = []; // Cho xóa nhiều user

  // Thông tin để xác nhận vô hiệu hóa
  userToDisable: { id: number, name: string } | null = null;
  usersToDisable: number[] = []; // Cho vô hiệu hóa nhiều user

  // Loại hành động đang thực hiện
  actionType: 'delete' | 'disable' | null = null;

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
    this.userToDisable = null; // Reset vô hiệu hóa
    this.usersToDisable = [];
    this.actionType = 'delete';
    this.showConfirmModal = true;
  }

  // Hiển thị modal xác nhận xóa nhiều người dùng
  confirmDeleteMultipleUsers(userIds: number[]): void {
    this.usersToDelete = userIds;
    this.userToDelete = null; // Reset xóa đơn
    this.userToDisable = null; // Reset vô hiệu hóa
    this.usersToDisable = [];
    this.actionType = 'delete';
    this.showConfirmModal = true;
  }

  // Hiển thị modal xác nhận vô hiệu hóa người dùng
  confirmDisableUser(userId: number, userName: string): void {
    this.userToDisable = { id: userId, name: userName };
    this.usersToDisable = []; // Reset vô hiệu hóa nhiều
    this.userToDelete = null; // Reset xóa
    this.usersToDelete = [];
    this.actionType = 'disable';
    this.showConfirmModal = true;
  }

  // Hiển thị modal xác nhận vô hiệu hóa nhiều người dùng
  confirmDisableMultipleUsers(userIds: number[]): void {
    this.usersToDisable = userIds;
    this.userToDisable = null; // Reset vô hiệu hóa đơn
    this.userToDelete = null; // Reset xóa
    this.usersToDelete = [];
    this.actionType = 'disable';
    this.showConfirmModal = true;
  }

  // Xác nhận thực hiện hành động (xóa hoặc vô hiệu hóa)
  proceedWithAction(): void {
    this.showConfirmModal = false;

    if (this.actionType === 'delete') {
      if (this.userToDelete) {
        // Xóa 1 người dùng
        this.executeDeleteUser(this.userToDelete.id, this.userToDelete.name);
      } else if (this.usersToDelete.length > 0) {
        // Xóa nhiều người dùng
        this.executeDeleteMultipleUsers(this.usersToDelete);
      }
    } else if (this.actionType === 'disable') {
      if (this.userToDisable) {
        // Vô hiệu hóa 1 người dùng
        this.executeDisableUser(this.userToDisable.id, this.userToDisable.name);
      } else if (this.usersToDisable.length > 0) {
        // Vô hiệu hóa nhiều người dùng
        this.executeDisableMultipleUsers(this.usersToDisable);
      }
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

  // Thực hiện vô hiệu hóa người dùng
  private executeDisableUser(userId: number, userName: string): void {
    this.isDisabling = true;

    this.adminService.disableUser(userId).subscribe({
      next: (response) => {
        console.log('Vô hiệu hóa người dùng thành công:', response);

        // Hiển thị modal thành công
        this.modalMessage = `Vô hiệu hóa người dùng "${userName}" thành công!`;
        this.showSuccessModal = true;

        // Tải lại danh sách người dùng
        this.loadUsers();

        this.isDisabling = false;
      },
      error: (error) => {
        console.error('Lỗi khi vô hiệu hóa người dùng:', error);

        // Hiển thị modal lỗi
        this.modalMessage = 'Có lỗi xảy ra khi vô hiệu hóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;

        this.isDisabling = false;
      }
    });
  }

  // Thực hiện vô hiệu hóa nhiều người dùng
  private executeDisableMultipleUsers(userIds: number[]): void {
    this.isDisabling = true;

    this.adminService.disableUsers(userIds).subscribe({
      next: (response) => {
        console.log('Vô hiệu hóa người dùng thành công:', response);

        // Hiển thị modal thành công
        this.modalMessage = `Vô hiệu hóa ${userIds.length} người dùng thành công!`;
        this.showSuccessModal = true;

        this.loadUsers();
        this.isDisabling = false;
      },
      error: (error) => {
        console.error('Lỗi khi vô hiệu hóa người dùng:', error);

        // Hiển thị modal lỗi
        this.modalMessage = 'Có lỗi xảy ra khi vô hiệu hóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;

        this.isDisabling = false;
      }
    });
  }

  // Hủy xác nhận
  cancelAction(): void {
    this.showConfirmModal = false;
    this.userToDelete = null;
    this.usersToDelete = [];
    this.userToDisable = null;
    this.usersToDisable = [];
    this.actionType = null;
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

  // Phương thức backward compatibility
  confirmDeleteUser_old = this.confirmDeleteUser;
  confirmDeleteMultipleUsers_old = this.confirmDeleteMultipleUsers;
  proceedWithDelete = this.proceedWithAction;
  cancelDelete = this.cancelAction;
}
