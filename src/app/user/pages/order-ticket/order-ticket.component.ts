import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TicketOrderService } from '../../services/ticket-order.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../pop-up/loading/loading.component';
import { ToastNotificationComponent } from '../../pop-up/toast-notification/toast-notification.component';
import { Router } from '@angular/router';

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

  minutes: string = '15';
  seconds: string = '00';
  private interval: any;
  private readonly STORAGE_KEY = 'countdown-timer';
  private readonly INITIAL_TIME = 15 * 60; // 15 phút
  private isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object,
    private ticketOrderService: TicketOrderService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initializeTimer();
    this.startTimer();

    setTimeout(() => {
      this.orderData = this.ticketOrderService.getOrder();
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
        this.notification.showNotification('Hết thời gian đặt vé. Vui lòng chọn lại vé !', 5000, 'warning');
        this.router.navigate(['/select-ticket']);
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
    this.notification.showNotification('Hết thời gian đặt vé. Vui lòng chọn lại vé !', 5000, 'warning');
    this.router.navigate(['/select-ticket'], { queryParams: { eventId: eventId } });
  }


  submitOrder() {
    this.ticketOrderService.orderTickets(this.orderData).subscribe({
      next: (res) => {
        console.log('Đặt vé thành công:', res);
        // Có thể redirect hoặc hiển thị thông báo
      },
      error: (err) => {
        console.error('Lỗi đặt vé:', err);
        // Có thể hiển thị thông báo lỗi
      }
    });
  }

  onNotificationClose() {}
}
