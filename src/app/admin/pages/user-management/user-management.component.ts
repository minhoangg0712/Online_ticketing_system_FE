import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from '../service/admin.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isDeleting: boolean = false;
  isDisabling: boolean = false;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showConfirmModal: boolean = false;
  showDetailModal: boolean = false;
  modalMessage: string = '';
  userToDelete: { id: number, name: string } | null = null;
  usersToDelete: number[] = [];
  userToDisable: { id: number, name: string } | null = null;
  usersToDisable: number[] = [];
  selectedUser: any = null;
  actionType: 'delete' | 'disable' | null = null;

  constructor(
    private adminService: AdminService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        console.log('Dữ liệu người dùng:', response.data.listUsers); // Debug dữ liệu API
        this.users = response.data.listUsers ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        this.modalMessage = 'Có lỗi xảy ra khi tải danh sách người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;
      }
    });
  }

  showUserDetails(user: any): void {
    console.log('Người dùng được chọn:', user); // Debug dữ liệu người dùng
    this.selectedUser = user;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedUser = null;
  }

  // Sanitize image URL for security
  getSafeImageUrl(url: string | null | undefined): SafeUrl | null {
    if (url) {
      console.log('URL ảnh:', url); // Debug URL ảnh
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return null;
  }

  // Handle image load errors
  handleImageError(event: Event): void {
    console.log('Lỗi tải ảnh:', (event.target as HTMLImageElement).src); // Debug lỗi tải ảnh
    (event.target as HTMLImageElement).src = 'assets/default-profile.png';
  }

  confirmDeleteUser(userId: number, userName: string): void {
    this.userToDelete = { id: userId, name: userName };
    this.usersToDelete = [];
    this.userToDisable = null;
    this.usersToDisable = [];
    this.actionType = 'delete';
    this.showConfirmModal = true;
  }

  confirmDeleteMultipleUsers(userIds: number[]): void {
    this.usersToDelete = userIds;
    this.userToDelete = null;
    this.userToDisable = null;
    this.usersToDisable = [];
    this.actionType = 'delete';
    this.showConfirmModal = true;
  }

  confirmDisableUser(userId: number, userName: string): void {
    this.userToDisable = { id: userId, name: userName };
    this.usersToDisable = [];
    this.userToDelete = null;
    this.usersToDelete = [];
    this.actionType = 'disable';
    this.showConfirmModal = true;
  }

  confirmDisableMultipleUsers(userIds: number[]): void {
    this.usersToDisable = userIds;
    this.userToDisable = null;
    this.userToDelete = null;
    this.usersToDelete = [];
    this.actionType = 'disable';
    this.showConfirmModal = true;
  }

  proceedWithAction(): void {
    this.showConfirmModal = false;

    if (this.actionType === 'delete') {
      if (this.userToDelete) {
        this.executeDeleteUser(this.userToDelete.id, this.userToDelete.name);
      } else if (this.usersToDelete.length > 0) {
        this.executeDeleteMultipleUsers(this.usersToDelete);
      }
    } else if (this.actionType === 'disable') {
      if (this.userToDisable) {
        this.executeDisableUser(this.userToDisable.id, this.userToDisable.name);
      } else if (this.usersToDisable.length > 0) {
        this.executeDisableMultipleUsers(this.usersToDisable);
      }
    }
  }

  private executeDeleteUser(userId: number, userName: string): void {
    this.isDeleting = true;

    this.adminService.deleteUser(userId).subscribe({
      next: (response) => {
        console.log('Xóa người dùng thành công:', response);
        this.modalMessage = `Xóa người dùng "${userName}" thành công!`;
        this.showSuccessModal = true;
        this.loadUsers();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error);
        this.modalMessage = 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.isDeleting = false;
      }
    });
  }

  private executeDeleteMultipleUsers(userIds: number[]): void {
    this.isDeleting = true;

    this.adminService.deleteUsers(userIds).subscribe({
      next: (response) => {
        console.log('Xóa người dùng thành công:', response);
        this.modalMessage = `Xóa ${userIds.length} người dùng thành công!`;
        this.showSuccessModal = true;
        this.loadUsers();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error);
        this.modalMessage = 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.isDeleting = false;
      }
    });
  }

  private executeDisableUser(userId: number, userName: string): void {
    this.isDisabling = true;

    this.adminService.disableUser(userId).subscribe({
      next: (response) => {
        console.log('Vô hiệu hóa người dùng thành công:', response);
        this.modalMessage = `Vô hiệu hóa người dùng "${userName}" thành công!`;
        this.showSuccessModal = true;
        this.loadUsers();
        this.isDisabling = false;
      },
      error: (error) => {
        console.error('Lỗi khi vô hiệu hóa người dùng:', error);
        this.modalMessage = 'Có lỗi xảy ra khi vô hiệu hóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.isDisabling = false;
      }
    });
  }

  private executeDisableMultipleUsers(userIds: number[]): void {
    this.isDisabling = true;

    this.adminService.disableUsers(userIds).subscribe({
      next: (response) => {
        console.log('Vô hiệu hóa người dùng thành công:', response);
        this.modalMessage = `Vô hiệu hóa ${userIds.length} người dùng thành công!`;
        this.showSuccessModal = true;
        this.loadUsers();
        this.isDisabling = false;
      },
      error: (error) => {
        console.error('Lỗi khi vô hiệu hóa người dùng:', error);
        this.modalMessage = 'Có lỗi xảy ra khi vô hiệu hóa người dùng. Vui lòng thử lại!';
        this.showErrorModal = true;
        this.isDisabling = false;
      }
    });
  }

  cancelAction(): void {
    this.showConfirmModal = false;
    this.userToDelete = null;
    this.usersToDelete = [];
    this.userToDisable = null;
    this.usersToDisable = [];
    this.actionType = null;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.modalMessage = '';
  }

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
