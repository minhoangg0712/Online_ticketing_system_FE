import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-nav-user',
  imports: [],
  templateUrl: './nav-user.component.html',
  styleUrl: './nav-user.component.css'
})
export class NavUserComponent {
  constructor(private router: Router,private userService: UserService) {}

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
