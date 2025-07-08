import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-export-file',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './export-file.component.html',
  styleUrl: './export-file.component.css'
})
export class ExportFileComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  isLoadingList = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không tìm thấy token đăng nhập!');
      return;
    }

    this.fetchEvents(token);
  }

  fetchEvents(token: string): void {
    this.isLoadingList = true;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/api/events/by-organizer', { headers })
      .subscribe({
        next: (res) => {
          console.log('Danh sách sự kiện:', res);
          this.events = res.data?.listEvents || [];
          this.isLoadingList = false;
        },
        error: (err) => {
          console.error('Lỗi khi lấy danh sách sự kiện:', err);
          this.isLoadingList = false;
        }
      });
  }

  openDetail(event: any): void {
    this.selectedEvent = event;
  }

  closeDetail(): void {
    this.selectedEvent = null;
  }
}
