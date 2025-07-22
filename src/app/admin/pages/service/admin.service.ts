import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/users';
  private eventsApiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  // ==================== USER METHODS ====================

  // Lấy danh sách người dùng
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Lấy thông tin chi tiết người dùng
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

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

  // ==================== EVENT METHODS ====================

  // Lấy danh sách tất cả sự kiện
  getEvents(): Observable<any> {
    return this.http.get<any>(this.eventsApiUrl);
  }

  // Lấy danh sách sự kiện theo trạng thái
 // Trong file admin.service.ts

getEventsByStatus(status: string): Observable<any> {
  return this.http.get<any>(`${this.eventsApiUrl}?approvalStatus=${status}`);
}
  // Lấy danh sách sự kiện cần duyệt
  getPendingEvents(): Observable<any> {
    return this.getEventsByStatus('pending');
  }

  // Lấy danh sách sự kiện đã duyệt
  getApprovedEvents(): Observable<any> {
    return this.getEventsByStatus('approved');
  }

  // Lấy danh sách sự kiện bị từ chối
  getRejectedEvents(): Observable<any> {
    return this.getEventsByStatus('rejected');
  }

  // Lấy thông tin chi tiết sự kiện
  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/${eventId}`);
  }

  // Lấy số lượng sự kiện
  getEventCount(): Observable<number> {
    return this.http.get<any>(this.eventsApiUrl).pipe(
      map(response => {
        // Xử lý response theo cấu trúc API của bạn
        if (response && response.data && response.data.listEvents && Array.isArray(response.data.listEvents)) {
          return response.data.listEvents.length;
        }
        return 0;
      })
    );
  }

  // Lấy số lượng sự kiện theo trạng thái
  getEventCountByStatus(status: string): Observable<number> {
    return this.getEventsByStatus(status).pipe(
      map(response => {
        if (response && response.data && response.data.listEvents && Array.isArray(response.data.listEvents)) {
          return response.data.listEvents.length;
        }
        return 0;
      })
    );
  }

  // Duyệt sự kiện
  approveEvent(eventId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization header sẽ được thêm bởi HTTP Interceptor
    });

    return this.http.put<any>(
      `${this.apiUrl}/admin/approve-event?eventId=${eventId}`,
      {},
      { headers }
    );
  }

  // Duyệt nhiều sự kiện
  approveEvents(eventIds: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization header sẽ được thêm bởi HTTP Interceptor
    });

    // Giả định API hỗ trợ duyệt hàng loạt với body chứa danh sách ids
    const body = {
      ids: eventIds
    };

    return this.http.put<any>(`${this.apiUrl}/admin/approve-event`, body, { headers });
  }

  // Từ chối sự kiện
  rejectEvent(eventId: number, reason: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization header được thêm bởi HTTP Interceptor
    });

    const body = {
      rejectionReason: reason || 'Không đạt yêu cầu'
    };

    return this.http.put<any>(
      `${this.apiUrl}/admin/reject-event?eventId=${eventId}`,
      body,
      { headers }
    );
  }

  // Từ chối nhiều sự kiện
  rejectEvents(eventIds: number[], reason: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Authorization header được thêm bởi HTTP Interceptor
    });

    // Giả định API không hỗ trợ từ chối hàng loạt, gọi rejectEvent cho từng id
    const rejectObservables = eventIds.map(id => this.rejectEvent(id, reason));
    return forkJoin(rejectObservables);


  }

  // Thu hồi duyệt sự kiện (đưa về trạng thái pending)
  revokeApproval(eventId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.eventsApiUrl}/${eventId}/revoke`, {}, { headers });
  }

  // Thu hồi duyệt nhiều sự kiện
  revokeApprovals(eventIds: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      ids: eventIds
    };

    return this.http.put<any>(`${this.eventsApiUrl}/revoke`, body, { headers });
  }

  // Xóa sự kiện
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.eventsApiUrl}/${eventId}`);
  }

  // Xóa nhiều sự kiện
  deleteEvents(eventIds: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      ids: eventIds
    };

    return this.http.delete<any>(`${this.eventsApiUrl}/delete`, {
      headers: headers,
      body: body
    });
  }

  // Tìm kiếm sự kiện
  searchEvents(keyword: string): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/search?keyword=${encodeURIComponent(keyword)}`);
  }

  // Lấy sự kiện theo danh mục
  getEventsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}?category=${encodeURIComponent(category)}`);
  }

  // Lấy sự kiện theo người tổ chức
  getEventsByOrganizer(organizerId: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}?organizer=${organizerId}`);
  }

  // Lấy lý do từ chối sự kiện
  getRejectionReason(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/${eventId}/rejection-reason`);
  }

  exportEventExcel(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/report/excel`, { responseType: 'blob' });
  }

  exportEventPdf(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/report/pdf`, { responseType: 'blob' });
  }
}
