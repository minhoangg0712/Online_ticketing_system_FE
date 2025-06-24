import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateEventsService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  createEvent(
    eventData: any,
    logo: File,
    background: File
  ): Observable<any> {
    const formData = new FormData();

    // Gửi JSON dưới dạng "data" (phải match @RequestPart("data"))
    formData.append('data', new Blob(
      [JSON.stringify(eventData)],
      { type: 'application/json' }
    ));

    // Gửi ảnh logo & background
    formData.append('logo', logo);
    formData.append('background', background);

    return this.http.post(this.apiUrl, formData);
  }
}
