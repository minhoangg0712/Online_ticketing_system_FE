import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListEventsService {
  private apiUrl = 'http://localhost:8080/api/events/by-organizer';

  constructor(private http: HttpClient) { }

  getEventsByOrganizer(): Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }
}