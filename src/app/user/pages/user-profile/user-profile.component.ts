import { Component } from '@angular/core';
import { NavUserComponent } from '../../../component/nav-user/nav-user.component';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [NavUserComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  profileForm!: FormGroup;
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
        // console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    });
  }
}
