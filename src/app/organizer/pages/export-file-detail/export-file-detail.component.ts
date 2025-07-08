import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListEventsService } from '../../services/list-events.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export-file-detail',
  templateUrl: './export-file-detail.component.html',
  styleUrls: ['./export-file-detail.component.css'],
  standalone: true,
  imports: [ CommonModule ]
})
export class ExportFileDetailComponent implements OnInit {
  eventId!: number;
  eventData: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private listEventsService: ListEventsService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.listEventsService.getEventById(this.eventId).subscribe({
      next: (res: any) => {
        this.eventData = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
