// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login attempt:', this.loginForm.value);
      // Handle login logic here
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

  loginWithFacebook() {
    console.log('Login with Facebook');
    // Handle Facebook login
  }

  loginWithApple() {
    console.log('Login with Apple');
    // Handle Apple login
  }

  loginWithTwitter() {
    console.log('Login with Twitter');
    // Handle Twitter login
  }

  forgotPassword() {
    console.log('Forgot password clicked');
    // Handle forgot password
  }

  createAccount() {
    console.log('Create account clicked');
    // Handle create account
  }
}