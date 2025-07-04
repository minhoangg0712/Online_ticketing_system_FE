import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastNotificationComponent } from '../../../user/pop-up/toast-notification/toast-notification.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  selectedFile: File | null = null;
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
      const profileData = {
        fullName: this.profileForm.value.fullName,
        phoneNumber: this.profileForm.value.phoneNumber,
        address: this.profileForm.value.address,
        bio: this.profileForm.value.bio || '',
        email: this.profileForm.getRawValue().email,
        avatarUrl: this.profileForm.value.avatarUrl
      };

      // So sánh dữ liệu hiện tại với dữ liệu gốc
      const isProfileChanged = Object.entries(profileData).some(
        ([key, value]) => value !== this.originalProfileData[key as keyof typeof this.originalProfileData]
      );

      const isAvatarChanged = !!this.selectedFile;

    if (!isProfileChanged && !isAvatarChanged) {
      this.notification.showNotification('Không có thay đổi nào để cập nhật', 5000, 'warning');
      return;
    }

    // Nếu chỉ đổi avatar
    if (isAvatarChanged && !isProfileChanged) {
      this.uploadAvatarOnly();
    }

    // Nếu chỉ đổi profile
    if (isProfileChanged && !isAvatarChanged) {
      this.updateProfileOnly(profileData);
    }

    // Nếu đổi cả hai
    if (isProfileChanged && isAvatarChanged) {
      this.userService.updateUserProfile(profileData).subscribe({
        next: () => {
          this.originalProfileData = { ...profileData };
          this.uploadAvatarOnly();
          this.notification.showNotification('Cập nhật thông tin thành công', 5000, 'success');
        },
        error: (err) => {
          this.notification.showNotification('Cập nhật thông tin thất bại!', 5000, 'error');
          console.error(err);
        }
      });
    }
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.notification.showNotification('Chỉ chấp nhận các định dạng ảnh JPG, JPEG, PNG!', 5000, 'warning');
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;

      // ✅ Tạo ảnh preview
      const reader = new FileReader();
      reader.onload = () => {
        // Cập nhật giá trị avatarUrl trong form để hiển thị
        this.profileForm.get('avatarUrl')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfileOnly(profileData: any) {
    this.userService.updateUserProfile(profileData).subscribe({
      next: () => {
        this.notification.showNotification('Cập nhật thông tin thành công', 5000, 'success');
        this.originalProfileData = { ...profileData };
      },
      error: (err) => {
        this.notification.showNotification('Cập nhật thông tin thất bại!', 5000, 'error');
        console.error(err);
      }
    });
  }

  uploadAvatarOnly() {
    this.userService.uploadAvatar(this.selectedFile!).subscribe({
      next: (res) => {
        this.notification.showNotification('Cập nhật ảnh đại diện thành công', 5000, 'success');
        console.log(res);
        this.selectedFile = null; // reset sau khi upload
      },
      error: (err: HttpErrorResponse) => {
        this.notification.showNotification('Không upload được ảnh đại diện!', 5000, 'error');
        console.error(err);
      }
    });
  }
  onNotificationClose() {}
}