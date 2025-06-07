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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
      ]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (res) => {
          console.log('Login success:', res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
        }
      });
    } else {
      console.log('Form is invalid');
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
    console.log('Forgot password clicked');
    // Handle forgot password
  }

  createAccount() {
    this.router.navigate(['/register']); 
  }
}
