import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/users';
  private eventsApiUrl = 'http://localhost:8080/api/events';
  private ordersApiUrl = 'http://localhost:8080/api/orders';
  private reviewsApiUrl = 'http://localhost:8080/api/review';

  constructor(private http: HttpClient) {}

  // ==================== USER METHODS ====================

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      map(response => {
        console.log('Raw API response:', JSON.stringify(response, null, 2));
        if (response?.data?.listUsers) {
          response.data.listUsers = response.data.listUsers.map((user: any) => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            address: user.address,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            avatarUrl: user.avatarUrl,
            bio: user.bio
          }));
        }
        return response;
      })
    );
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { withCredentials: true }).pipe(
      map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        address: user.address,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      }))
    );
  }

  getUserCount(): Observable<number> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response =>
        response?.data?.listUsers && Array.isArray(response.data.listUsers)
          ? response.data.listUsers.length
          : 0
      )
    );
  }

  deleteUsers(userIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/delete`, {
      headers,
      body: { ids: userIds }
    });
  }

  deleteUser(userId: number): Observable<any> {
    return this.deleteUsers([userId]);
  }

  disableUsers(userIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/disable`, {
      headers,
      body: { ids: userIds }
    });
  }

  disableUser(userId: number): Observable<any> {
    return this.disableUsers([userId]);
  }

  getReviewsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.reviewsApiUrl}/user/${userId}`, { withCredentials: true });
  }

  approveOrganizer(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/admin/approve-organizer?userId=${userId}`, null, {
      headers,
      withCredentials: true
    });
  }

  // ==================== EVENT METHODS ====================

  getEvents(): Observable<any> {
    return this.http.get<any>(this.eventsApiUrl);
  }

  getEventsByStatus(status: string): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}?approvalStatus=${status}`);
  }

  getPendingEvents(): Observable<any> {
    return this.getEventsByStatus('pending');
  }

  getApprovedEvents(): Observable<any> {
    return this.getEventsByStatus('approved');
  }

  getRejectedEvents(): Observable<any> {
    return this.getEventsByStatus('rejected');
  }

  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/${eventId}`);
  }

  getEventCount(): Observable<number> {
    return this.http.get<any>(this.eventsApiUrl).pipe(
      map(response =>
        response?.data?.listEvents && Array.isArray(response.data.listEvents)
          ? response.data.listEvents.length
          : 0
      )
    );
  }

  getEventCountByStatus(status: string): Observable<number> {
    return this.getEventsByStatus(status).pipe(
      map(response =>
        response?.data?.listEvents && Array.isArray(response.data.listEvents)
          ? response.data.listEvents.length
          : 0
      )
    );
  }

  getReviewsByEventId(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.reviewsApiUrl}/event/${eventId}`, { withCredentials: true }).pipe(
      map(response => {
        console.log('Reviews response:', JSON.stringify(response, null, 2));
        if (response?.data?.reviewDetails) {
          return response.data.reviewDetails.map((review: any) => ({
            reviewId: review.reviewId,
            userId: review.userId,
            userFullName: review.userFullName,
            userProfilePicture: review.userProfilePicture,
            rating: review.rating,
            comment: review.comment,
            reviewDate: review.reviewDate
              ? new Date(review.reviewDate).toLocaleString('vi-VN')
              : 'Không xác định'
          }));
        }
        return [];
      })
    );
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${this.reviewsApiUrl}/delete/${reviewId}`, { withCredentials: true });
  }

  approveEvent(eventId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/admin/approve-event?eventId=${eventId}`, {}, { headers });
  }

  approveEvents(eventIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/admin/approve-event`, { ids: eventIds }, { headers });
  }

  rejectEvent(eventId: number, reason: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(
      `${this.apiUrl}/admin/reject-event?eventId=${eventId}`,
      { rejectionReason: reason || 'Không đạt yêu cầu' },
      { headers }
    );
  }

  rejectEvents(eventIds: number[], reason: string): Observable<any> {
    return forkJoin(eventIds.map(id => this.rejectEvent(id, reason)));
  }

  revokeApproval(eventId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.eventsApiUrl}/${eventId}/revoke`, {}, { headers });
  }

  revokeApprovals(eventIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.eventsApiUrl}/revoke`, { ids: eventIds }, { headers });
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.eventsApiUrl}/${eventId}`);
  }

  deleteEvents(eventIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.eventsApiUrl}/delete`, {
      headers,
      body: { ids: eventIds }
    });
  }

  searchEvents(keyword: string): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/search?keyword=${encodeURIComponent(keyword)}`);
  }

  getEventsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}?category=${encodeURIComponent(category)}`);
  }

  getEventsByOrganizer(organizerId: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}?organizer=${organizerId}`);
  }

  getRejectionReason(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/${eventId}/rejection-reason`);
  }

  exportEventExcel(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/report/excel`, { responseType: 'blob' });
  }

  exportEventPdf(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/report/pdf`, { responseType: 'blob' });
  }

  // ==================== ORDER METHODS ====================

  getOrders(params: {
    status?: string;
    startAmount?: number;
    endAmount?: number;
    startTime?: string;
    endTime?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    let queryParams = new HttpParams();
    if (params.status) queryParams = queryParams.set('status', params.status);
    if (params.startAmount != null) queryParams = queryParams.set('startAmount', params.startAmount.toString());
    if (params.endAmount != null) queryParams = queryParams.set('endAmount', params.endAmount.toString());
    if (params.startTime) queryParams = queryParams.set('startTime', params.startTime);
    if (params.endTime) queryParams = queryParams.set('endTime', params.endTime);
    queryParams = queryParams.set('page', (params.page || 0).toString());
    queryParams = queryParams.set('size', (params.size || 10).toString());

    return this.http.get<any>(`${this.ordersApiUrl}/list`, { params: queryParams });
  }

  getOrderCountByStatus(status: string): Observable<number> {
    return this.getOrders({ status }).pipe(
      map(response =>
        response?.data?.listOrders && Array.isArray(response.data.listOrders)
          ? response.data.totalItems || response.data.listOrders.length
          : 0
      )
    );
  }

  getOrderDetail(orderPayOSCode: number): Observable<any> {
    return this.http.get<any>(`${this.ordersApiUrl}/${orderPayOSCode}`);
  }

  cancelOrder(orderPayOSCode: number, cancellationReason: string): Observable<any> {
    return this.http.put<any>(`${this.ordersApiUrl}/${orderPayOSCode}`, {
      cancellationReason: cancellationReason || 'Đã hủy bởi quản trị viên'
    });
  }

  getCompletedEventCount(): Observable<number> {
    return this.http.get<any>(this.eventsApiUrl).pipe(
      map(response =>
        response?.data?.listEvents && Array.isArray(response.data.listEvents)
          ? response.data.listEvents.filter((event: any) => event.status === 'completed').length
          : 0
      )
    );
  }
}
