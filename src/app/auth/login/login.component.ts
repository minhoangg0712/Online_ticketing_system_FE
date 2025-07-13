import { Component, OnInit,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastNotificationComponent } from '../../user/pop-up/toast-notification/toast-notification.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  loginErrorMessage: string | null = null;
  errorMessage: string = '';
  @ViewChild('notification') notification!: ToastNotificationComponent;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (res: any) => {
          if (res.token) {
            this.authService.setToken(res.token);

            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
              sessionStorage.removeItem('redirectAfterLogin');
              this.router.navigateByUrl(redirectPath); // ✅ Ưu tiên redirect nếu có
              return; // ⛔ Dừng không xử lý điều hướng phía dưới nữa
            }

            // ✅ Nếu không có redirectPath thì mới phân quyền điều hướng
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin']);
            } else if (this.authService.isSeller()) {
              this.router.navigate(['/organizer']);
            } else if (this.authService.isCustomer()) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        error: (err) => {
          this.notification.showNotification('Sai tài khoản hoặc mật khẩu!', 5000, 'error');
        }
      });
    }
  }


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  loginWithGoogle() {
    console.log('Login with Google');
    // Handle Google login
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  createAccount() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  onNotificationClose() {
  }}
