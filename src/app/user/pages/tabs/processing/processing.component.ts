import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketOrderService } from '../../../services/ticket-order.service';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-processing',
  imports: [CommonModule],
  templateUrl: './processing.component.html',
  styleUrl: './processing.component.css'
})
export class ProcessingComponent {
  userId: string | null = null;
  ticketOrders: any[] = [];

  constructor(private router: Router,private ticketOrderService: TicketOrderService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId !== null) {
      this.loadProcessingOrders(this.userId);
    } else {
      console.error('User ID is null, cannot load orders.');
    }
  }

  loadProcessingOrders(userId: string) {
    this.ticketOrderService.getTicketsByUserId(+userId).subscribe({
      next: (data) => {
        this.ticketOrders = data
          .filter((order: any) => order.status === 'pending')
          .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      },
      error: (err) => {
        console.error('Error loading pending orders:', err);
      }
    });
  }
}
