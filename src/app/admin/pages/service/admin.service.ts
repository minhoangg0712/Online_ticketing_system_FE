import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service này sẽ được cung cấp ở cấp root
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL API cơ bản

  constructor(private http: HttpClient) {}

  // Lấy danh sách người dùng
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
