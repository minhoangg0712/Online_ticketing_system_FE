import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpcomingComponent } from '../../tabs/upcoming/upcoming.component';
import { PastComponent } from '../../tabs/past/past.component';
import { PendingComponent } from '../../tabs/pending/pending.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListEventsService } from '../../services/list-events.service';

@Component({
  selector: 'app-home-organizer',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    UpcomingComponent,
    PastComponent,
    PendingComponent,
  ],
  templateUrl: './home-organizer.component.html',
  styleUrl: './home-organizer.component.css'
})
export class HomeOrganizerComponent implements OnInit {
  selectedTab: string = 'upcoming';
  events: any[] = [];

  constructor(
    private http: HttpClient,
    private listEventsService: ListEventsService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không tìm thấy token đăng nhập!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/api/events/by-organizer', { headers })
      .subscribe(
        res => {
          this.events = res.data.listEvents;
          console.log("Danh sách sự kiện:", this.events);
        },
        err => {
          console.error('Lỗi khi tải danh sách sự kiện:', err);
        }
      );
  }

  setTab(tab: string) {
    this.selectedTab = tab;
  }
}
