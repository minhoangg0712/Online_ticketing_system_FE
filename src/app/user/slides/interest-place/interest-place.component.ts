import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-interest-place',
  imports: [CommonModule],
  templateUrl: './interest-place.component.html',
  styleUrl: './interest-place.component.css'
})
export class InterestPlaceComponent {
  interestPlaces = [
    {
      name: 'Tp. Hồ Chí Minh',
      image: 'assets/HCM.webp'
    },
    {
      name: 'Hà Nội',
      image: 'assets/HNOI.webp'
    },
    {
      name: 'Đà Lạt',
      image: 'assets/DALAT.webp'
    },
    {
      name: 'Vị trí khác',
      image: 'assets/ANOTHER.webp'
    }
  ];
}
