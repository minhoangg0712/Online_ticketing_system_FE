import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-user',
  imports: [CommonModule],
  templateUrl: './nav-user.component.html',
  styleUrl: './nav-user.component.css'
})
export class NavUserComponent {
  avatarUrl: string = '';

  constructor(private router: Router,private userService: UserService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.userService.getAvatar().subscribe(url => {
        this.avatarUrl = url;
      });
    } else {}
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToProfile() {
    this.router.navigate(['/user-profile']);
  }

  navigateToPurchasedTickets() {
    this.router.navigate(['/purchased-ticket']);
  }

  navigateToSelectTicket() {
    this.router.navigate(['/select-ticket']);
  }
  
  getFullName(): string | null {
    return this.userService.getFullName();
  }
}
