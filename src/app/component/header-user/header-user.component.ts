import { Component, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule, NgIf],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {
  isDropdownOpen = false;
  private hideTimer: any;
  avatarUrl: string = '';

  constructor(private router: Router, private authService: AuthService,
    private elementRef: ElementRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.userService.getAvatar().subscribe(url => {
        this.avatarUrl = url;
      });
    } else {}
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  logout(){
    this.authService.logout();
    window.location.href = '/home';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  }

  //Đóng dropdown khi nhấn ra ngoài 
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-profile');
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}