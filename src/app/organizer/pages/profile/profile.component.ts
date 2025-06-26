import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastNotificationComponent } from '../../../user/pop-up/toast-notification/toast-notification.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  originalProfileData: any;
  @ViewChild('notification') notification!: ToastNotificationComponent;
  
  showNotification = false;
  constructor(private fb: FormBuilder,private userService: UserService, private authService: AuthService ) {}

   ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: [''],
      email: [{value:'', disabled: true}], 
      phoneNumber: [''],
      bio: [''],
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
          address: data.address,
          bio: data.bio || ''
        };

        this.profileForm.patchValue({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          avatarUrl: data.avatarUrl,
          bio: data.bio || ''
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
        address: this.profileForm.value.address,
        bio: this.profileForm.value.bio || '',
        email: this.profileForm.getRawValue().email,
        avartaUrl: this.profileForm.value.avatarUrl
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
          this.originalProfileData = { ...profileData };
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật thông tin:', err);
        }
      });
    }
  }

  onNotificationClose() {}
}
