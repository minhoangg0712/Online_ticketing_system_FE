import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Lấy danh sách người dùng
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
    // Lấy số lượng người dùng
  // Lấy số lượng người dùng
  getUserCount(): Observable<number> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Xử lý response theo cấu trúc API của bạn
        if (response && response.data && response.data.listUsers && Array.isArray(response.data.listUsers)) {
          return response.data.listUsers.length;
        }
        return 0;
      })
    );
  }

  // Xóa người dùng
  deleteUsers(userIds: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      ids: userIds
    };

    return this.http.delete<any>(`${this.apiUrl}/delete`, {
      headers: headers,
      body: body
    });
  }

  // Xóa một người dùng (helper method)
  deleteUser(userId: number): Observable<any> {
    return this.deleteUsers([userId]);
  }

  // Vô hiệu hóa người dùng
  disableUsers(userIds: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      ids: userIds
    };

    return this.http.delete<any>(`${this.apiUrl}/disable`, {
      headers: headers,
      body: body
    });
  }

  // Vô hiệu hóa một người dùng (helper method)
  disableUser(userId: number): Observable<any> {
    return this.disableUsers([userId]);
  }

}
