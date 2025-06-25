import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor( private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  @Inject(PLATFORM_ID) private platformId: Object) { }


  // Helper method để kiểm tra có phải browser không
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Helper method để truy cập localStorage an toàn
  private getLocalStorage(): Storage | null {
    return this.isBrowser() ? localStorage : null;
  }

  /** Lấy thông tin người dùng */
  getUserInfo(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      if (isPlatformBrowser(this.platformId)) {
        console.warn('⚠️ Token chưa sẵn sàng trong browser');
      }
      return EMPTY; // Observable rỗng không lỗi
    }


    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/current-profile`, { headers });
  }

  /** Lấy ảnh đại diện của người dùng */
  getAvatar(): Observable<string> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ data: string; message: string; status: number }>(
      `${this.apiUrl}/profile-picture`,
      { headers }
    ).pipe(
      map(response => response.data) // Lấy phần data là URL ảnh
    );
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token'); 
  } 
}
