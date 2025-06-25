import { Component, ViewChild } from '@angular/core';
import { NavUserComponent } from '../../../component/nav-user/nav-user.component';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';

@Component({
  selector: 'app-user-profile',
  imports: [NavUserComponent, CommonModule, ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  profileForm!: FormGroup;
  originalProfileData: any;
  @ViewChild('notification') notification!: ToastNotificationComponent;
  
  showNotification = false;
  

  constructor(private fb: FormBuilder,private userService: UserService, private authService: AuthService ) {}

   ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: [''],
      email: [''],
      phoneNumber: [''],
      gender: [''],
      address: [''],
      avatarUrl: ['']
    });
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userService.getUserInfo().subscribe({
      next: (response) => {
        const data = response.data;

        // Lưu dữ liệu gốc để so sánh
        this.originalProfileData = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          address: data.address,
          bio: data.bio || ''
        };

        this.profileForm.patchValue({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          address: data.address,
          avatarUrl: data.avatarUrl
        });
      },
      error: (err) => {
      //  console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    });
  }

   onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData = {
        fullName: this.profileForm.value.fullName,
        phoneNumber: this.profileForm.value.phoneNumber,
        gender: this.profileForm.value.gender,
        address: this.profileForm.value.address,
        bio: this.profileForm.value.bio || ''
      };

      // So sánh dữ liệu hiện tại với dữ liệu gốc
      const isChanged = Object.entries(profileData).some(
        ([key, value]) => value !== this.originalProfileData[key as keyof typeof this.originalProfileData]
      );

      if (!isChanged) {
        this.notification.showNotification('Không có thay đổi nào để cập nhật', 5000, 'warning');
        return;
      }
      
      this.userService.updateUserProfile(profileData).subscribe({
        next: (res) => {
          this.notification.showNotification('Cập nhật profile thành công', 5000, 'success');
          this.originalProfileData = { ...profileData }; // cập nhật bản gốc
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật thông tin:', err);
        }
      });
    }
  }

  onNotificationClose() {}
}
