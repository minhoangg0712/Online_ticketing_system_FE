import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Helper method để kiểm tra có phải browser không
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Helper method để truy cập localStorage an toàn
  private getLocalStorage(): Storage | null {
    return this.isBrowser() ? localStorage : null;
  }

  /** Gửi mã xác minh đến email */
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sendVerificationCode`, { email }, { responseType: 'text' });
  }

  /** Kiểm tra mã xác minh */
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyCode`, { email, code }, { responseType: 'json' });
  }

  /** Đăng ký tài khoản mới */
  register(email: string, password: string, confirmPassword: string, fullName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, confirmPassword, fullName }, { responseType: 'text' });
  }

  /** Đăng nhập */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.token && this.isBrowser()) {
          this.setToken(res.token);

          try {
            // Giải mã token để lấy thông tin user
            const decodedToken: any = jwtDecode(res.token);
            const storage = this.getLocalStorage();
            if (storage) {
              if (decodedToken.sub) {
                storage.setItem('userId', decodedToken.sub);
              }
              
              if (decodedToken.user_fullName) {
                storage.setItem('fullName',decodedToken.user_fullName);
              }
            }

          } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
          }
        }
      })
    );
  }

  // Lấy userid
  getUserId(): number | null { 
    const token = localStorage.getItem('access_token'); 
    if (!token) return null; 

    try { 
      const decodedToken: any = jwtDecode(token); 
      return Number(decodedToken.sub); // ID người dùng 
    } catch (error) { 
      console.error('Lỗi khi giải mã token:', error); 
      return null; 
    } 
  } 

  /*Lưu token vào localStorage */
  setToken(token: string): void { 
    localStorage.setItem('access_token', token); 
    const decodedToken = this.decodeToken(token); 
    if (decodedToken) { 
      localStorage.setItem('user_role', JSON.stringify(decodedToken.user_role)); // Lưu role vào localStorage 
    } 
  } 

  /*Lấy token */
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('access_token'); 
  } 

  /*Kiểm tra xem user có đăng nhập không */
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!this.getToken();
  }

  /*Đăng xuất */
  logout(): void {
    if (!this.isBrowser()) return;
    
    const storage = this.getLocalStorage();
    if (storage) {
      storage.clear();
    }
    
    // Clear sessionStorage if available
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  }

  /*Giải mã token */
  decodeToken(token: string): any {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  /*Lấy role từ localStorage hoặc token */
  getRole(): string | null { 
    const token = this.getToken(); 
    if (!token) return null; 

    try { 
      const decodedToken: any = jwtDecode(token); 
      return decodedToken.user_role || null; // Lấy role từ JWT 
    } catch (error) { 
      console.error('Invalid token:', error); 
      return null; 
    } 
  } 

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'admin' || role === 'ADMIN';
  }

  isSeller(): boolean {
    const role = this.getRole();
    return role === 'organizer' || role === 'ORGANIZER';
  }

  isCustomer(): boolean {
    const role = this.getRole();
    return role === 'customer' || role === 'CUSTOMER';
  }
}