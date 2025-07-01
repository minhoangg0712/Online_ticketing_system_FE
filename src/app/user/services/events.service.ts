import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

   getRecommendedEvents(
    category?: string,
    address?: string,
    startTime?: Date,
    endTime?: Date,
    name?: string,
    page: number = 1,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams();

    if (category) params = params.set('category', category);
    if (address) params = params.set('address', address);
    if (startTime) params = params.set('startTime', startTime.toISOString());
    if (endTime) params = params.set('endTime', endTime.toISOString());
    if (name) params = params.set('name', name);

    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get(`${this.apiUrl}/recommend`, { params });
  }

  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}`);
  }
}
