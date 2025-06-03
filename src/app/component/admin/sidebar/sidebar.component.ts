import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Nhập RouterModule

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Thêm RouterModule vào imports
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Sửa styleUrl thành styleUrls
})
export class SidebarComponent {}
