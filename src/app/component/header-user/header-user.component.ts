import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule, NgIf],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/signup']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  logout(){
    this.authService.logout();
    window.location.href = '/home';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}