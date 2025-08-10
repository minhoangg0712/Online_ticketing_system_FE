import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-user',
  imports: [CommonModule],
  templateUrl: './footer-user.component.html',
  styleUrl: './footer-user.component.css'
})
export class FooterUserComponent {

  constructor(private router: Router) {}

  policies = [
    'Chính sách bảo mật thông tin',
    'Cơ chế giải quyết tranh chấp/khiếu nại',
    'Chính sách bảo mật thanh toán',
    'Chính sách đổi trả và kiểm hàng',
    'Điều kiện vận chuyển và giao nhận',
    'Phương thức thanh toán'
  ];


  RegisterBeOrganizer() {
    this.router.navigate(['/register-organizer']);
  }

  navigateToPolicy(policy: string) {
    switch (policy) {
      case 'Điều khoản sử dụng cho khách hàng':
        this.router.navigate(['/terms-of-use']);
        break;
      case 'Chính sách bảo mật thông tin':
        this.router.navigate(['/privacy-policy']);
        break;
      case 'Cơ chế giải quyết tranh chấp/khiếu nại':
        this.router.navigate(['/dispute-resolution']);
        break;
      case 'Chính sách bảo mật thanh toán':
        this.router.navigate(['/payment-security']);
        break;
      case 'Chính sách đổi trả và kiểm hàng':
        this.router.navigate(['/return-policy']);
        break;
    }
  }
}
