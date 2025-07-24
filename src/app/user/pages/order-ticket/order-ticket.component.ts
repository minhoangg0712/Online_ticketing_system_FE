import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TicketOrderService } from '../../services/ticket-order.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../pop-up/loading/loading.component';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-order-ticket',
  imports: [ CommonModule, LoadingComponent, ToastNotificationComponent],
  templateUrl: './order-ticket.component.html',
  styleUrl: './order-ticket.component.css'
})
export class OrderTicketComponent implements OnInit, OnDestroy {
  orderData: any;
  isLoading: boolean = true;
  @ViewChild('notification') notification!: ToastNotificationComponent;
  showNotification = false;
  eventDetail: any;

  minutes: string = '15';
  seconds: string = '00';
  private interval: any;
  private readonly STORAGE_KEY = 'countdown-timer';
  private readonly INITIAL_TIME = 15 * 60; // 15 phút
  private isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object,
    private ticketOrderService: TicketOrderService,
    private eventsService: EventsService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initializeTimer();
    this.startTimer();

    setTimeout(() => {
      this.orderData = this.ticketOrderService.getOrder();

      if (!this.orderData) {
        if (!this.isBrowser) return;
        const orderDataString = sessionStorage.getItem('orderData');
        if (orderDataString) {
          try {
            this.orderData = JSON.parse(orderDataString);
          } catch (error) {
            console.error('Lỗi parse orderData từ sessionStorage:', error);
          }
        }
      }

      // Nếu orderData có eventId thì bạn có thể gọi loadEventDetail ở đây (nếu cần)
      const eventId = this.orderData?.eventId;
      if (eventId) {
        this.loadEventDetail(eventId); // Gọi hàm của bạn
      }

      this.isLoading = false;
    }, 100);
  }


  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private initializeTimer() {
    if (!this.isBrowser) {
      this.updateDisplay(this.INITIAL_TIME);
      return;
    }

    const savedData = sessionStorage.getItem(this.STORAGE_KEY);
    
    if (savedData) {
      const { endTime } = JSON.parse(savedData);
      const now = Date.now();
      
      if (now < endTime) {
        // Timer vẫn còn hiệu lực
        const remainingTime = Math.ceil((endTime - now) / 1000);
        this.updateDisplay(remainingTime);
      } else {
        // Timer đã hết hạn
        this.resetTimer();
      }
    } else {
      // Lần đầu tiên vào trang trong session
      this.resetTimer();
    }
  }

  private resetTimer() {
    if (!this.isBrowser) return;
    
    const endTime = Date.now() + (this.INITIAL_TIME * 1000);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify({ endTime }));
    this.updateDisplay(this.INITIAL_TIME);
  }

  private startTimer() {
    if (!this.isBrowser) return;
    
    this.interval = setInterval(() => {
      const savedData = sessionStorage.getItem(this.STORAGE_KEY);
      
      if (savedData) {
        const { endTime } = JSON.parse(savedData);
        const now = Date.now();
        const remainingTime = Math.ceil((endTime - now) / 1000);
        
        if (remainingTime > 0) {
          this.updateDisplay(remainingTime);
        } else {
          // Timer đã hết
          this.updateDisplay(0);
          clearInterval(this.interval);
          this.onTimerEnd();
        }
      }
    }, 1000);
  }

  private updateDisplay(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    this.minutes = minutes.toString().padStart(2, '0');
    this.seconds = seconds.toString().padStart(2, '0');
  }

  private onTimerEnd() {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }

    const eventId = this.orderData?.eventId; 

    // Hiển thị thông báo
    this.notification.showNotification('Hết thời gian đặt vé. Vui lòng chọn lại vé !', 3000, 'warning');

    // Chuyển hướng sau 3 giây (thời gian hiển thị thông báo)
    setTimeout(() => {
      if (eventId) {
        this.router.navigate(['/select-ticket', eventId]);
      }
    }, 3000);
  } 

  loadEventDetail(eventId: number) {
    this.eventsService.getEventById(eventId).subscribe({
      next: (res) => {
        this.eventDetail = res.data; // <- Chỉ lấy phần 'data'
      },
      error: (err) => {
        console.error('Lỗi khi load chi tiết sự kiện:', err);
      }
    });
  }

  submitOrder() {
    const paymentData = {
      ...this.orderData,
      returnUrl: 'https://url.ngrok-free.app/success',
      cancelUrl: 'https://url.ngrok-free.app/cancel'
    };

    this.ticketOrderService.payOrder(paymentData).subscribe({
      next: (res: any) => {
        const checkoutUrl = res?.data?.checkoutUrl;
        if (checkoutUrl) {
          // 👉 Redirect người dùng sang trang thanh toán PayOS
          window.location.href = checkoutUrl;
        } else {
          this.notification.showNotification('Không tìm thấy liên kết thanh toán!', 3000, 'error');
        }
      },
      error: (err) => {
        console.error('Lỗi đặt vé:', err);
        this.notification.showNotification('Không thể đặt vé. Vui lòng thử lại.', 3000, 'error');
      }
    });
  }

  onNotificationClose() {}
}
