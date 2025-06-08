import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-footer-user',
  imports: [CommonModule],
  templateUrl: './footer-user.component.html',
  styleUrl: './footer-user.component.css'
})
export class FooterUserComponent {
  policies = [
    'Chính sách bảo mật thông tin',
    'Cơ chế giải quyết tranh chấp/khiếu nại',
    'Chính sách bảo mật thanh toán',
    'Chính sách đổi trả và kiểm hàng',
    'Điều kiện vận chuyển và giao nhận',
    'Phương thức thanh toán'
  ];
}
