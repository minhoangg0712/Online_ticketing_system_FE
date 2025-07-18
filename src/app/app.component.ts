import { Component } from '@angular/core';
import { RouterOutlet,Router,NavigationEnd } from '@angular/router';
import { HeaderUserComponent } from "./component/header-user/header-user.component";
import { CommonModule } from "@angular/common";
import { FooterUserComponent } from "./component/footer-user/footer-user.component";
import { AuthService } from './auth/services/auth.service';
import { SliderCaptchaComponent } from './user/pages/slider-captcha/slider-captcha.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderUserComponent, CommonModule, FooterUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Online_ticketing_system_FE';
  isAuthPage: boolean = false;

  constructor(private router: Router,private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra nếu trang hiện tại là trang đăng nhập hoặc đăng ký
        this.isAuthPage = event.url.includes('/login') || event.url.includes('/register')
        || event.url.includes('/forgot-password')
        || event.url.includes('/organizer')
        || event.url.includes('/admin')
        || event.url.includes('/slider-captcha');
      }
    });
  }
}
