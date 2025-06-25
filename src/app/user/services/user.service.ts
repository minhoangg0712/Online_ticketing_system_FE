import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, EMPTY, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
    return this.http.get(`${this.apiUrl}/current-profile`);
  }

  /** Lấy ảnh đại diện của người dùng */
  getAvatar(): Observable<string> {
    return this.http.get<{ data: string; message: string; status: number }>(
        `${this.apiUrl}/profile-picture`,
    ).pipe(
        map(response => response.data),
        catchError(error => {
            console.error('Avatar API error details:', {
                status: error.status,
                message: error.message,
                error: error.error
            });
            return of('assets/default-avatar.png');
        })
    );
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token'); 
  } 
}
