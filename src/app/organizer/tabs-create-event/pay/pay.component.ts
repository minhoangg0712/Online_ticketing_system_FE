import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent {
  @Input() infoData: any;
  @Input() dateData: any;
  @Input() totalAmount: number = 0;

  loading = false;

  constructor(private http: HttpClient) {}

  payWithVnpay() {
    this.loading = true;
    // Chuẩn bị payload gửi lên backend
    const payload = {
      ...this.infoData,
      ...this.dateData,
      totalAmount: this.totalAmount
    };
    this.http.post<any>('/api/payment/vnpay/create', payload)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res && res.paymentUrl) {
            window.location.href = res.paymentUrl;
          } else {
            alert('Không lấy được link thanh toán!');
          }
        },
        error: (err) => {
          this.loading = false;
          alert('Có lỗi khi tạo thanh toán!');
        }
      });
  }
}
