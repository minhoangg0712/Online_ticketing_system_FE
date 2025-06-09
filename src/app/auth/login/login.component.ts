import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  loginErrorMessage: string | null = null;

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
            
            // Sau khi đăng nhập thành công, kiểm tra role và điều hướng
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
        error: (err) => {}
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
}
