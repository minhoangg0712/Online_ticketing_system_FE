import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Định nghĩa enum UserRole
  static readonly UserRole = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    ORGANIZER: 'organizer'
  } as const;

  private apiBaseUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<any>;
  public isLoggedIn$: BehaviorSubject<boolean>;
  public currentUser$: Observable<any>;
  private isBrowser: boolean;

  constructor(
  private http: HttpClient, 
  private router: Router,
  @Inject(PLATFORM_ID) platformId: Object
) {
  this.isBrowser = isPlatformBrowser(platformId);

  const storedUser = this.isBrowser
    ? JSON.parse(localStorage.getItem('currentUser') || 'null')
    : null;

  this.currentUserSubject = new BehaviorSubject<any>(storedUser);
  this.isLoggedIn$ = new BehaviorSubject<boolean>(!!storedUser);
  this.currentUser$ = this.currentUserSubject.asObservable();
}


  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  /** Gửi mã xác minh đến email */
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/sendVerificationCode`, { email }, { responseType: 'text' });
  }

  /** Kiểm tra mã xác minh */
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/verifyCode`, { email, code }, { responseType: 'json' });
  }

  /** Đăng ký tài khoản mới */
  register(email: string, password: string, confirmPassword: string, fullName: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/register`, { email, password, confirmPassword, fullName }, { responseType: 'text' });
  }

  /** Đăng nhập */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoggedIn$.next(true);
        return user;
      }));
  }

  /** Lưu thông tin người dùng sau khi đăng nhập */
  setCurrentUser(user: any) {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  /** Lấy thông tin người dùng hiện tại */
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  /** Lấy role của người dùng hiện tại */
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /** Kiểm tra xem người dùng có role cụ thể không */
  hasRole(role: string): boolean {
    return this.getCurrentUserRole() === role;
  }

  /** Đăng xuất */
  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  /** Kiểm tra xem người dùng đã đăng nhập chưa */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.hasRole(AuthService.UserRole.ADMIN);
  }

  isOrganizer(): boolean {
    return this.hasRole(AuthService.UserRole.ORGANIZER);
  }

  isCustomer(): boolean {
    return this.hasRole(AuthService.UserRole.CUSTOMER);
  }
}
