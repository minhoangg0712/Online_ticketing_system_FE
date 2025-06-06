import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient, private router: Router) { }
  
  /*Gửi mã xác minh đến email */
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sendVerificationCode`, { email }, { responseType: 'text' });
  }

  /*Kiểm tra mã xác minh */
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyCode`, { email, code }, { responseType: 'json' });
  }

  /*Đăng ký tài khoản mới */
  register(email: string, password: string, confirmPassword: string, fullName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, confirmPassword, fullName }, { responseType: 'text' });
  }
}
