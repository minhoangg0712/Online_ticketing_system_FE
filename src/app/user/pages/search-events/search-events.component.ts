import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-events',
  imports: [CommonModule],
  templateUrl: './search-events.component.html',
  styleUrl: './search-events.component.css'
})
export class SearchEventsComponent {
  events = [
    {
      title: 'VIỆT NAM BÁCH NGHỆ',
      image: 'https://storage.googleapis.com/a1aa/image/9237be81-2046-41e6-2fac-88f4fefc513e.jpg',
      alt: 'Colorful artistic poster',
      price: '300.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: '[DÉ GARDEN] Terrarium Workshop',
      image: 'https://storage.googleapis.com/a1aa/image/c2923c35-9e48-4743-3754-a945bc81d84f.jpg',
      alt: 'Terrarium workshop',
      price: '445.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: '[GARDEN ART] - ART WORKSHOP "FLORAL CAKE"',
      image: 'https://storage.googleapis.com/a1aa/image/d5bedebe-fb5b-4210-d6be-d00ed81e0636.jpg',
      alt: 'Floral Cake',
      price: '390.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: '[DÉ GARDEN] Moss Frame Workshop',
      image: 'https://storage.googleapis.com/a1aa/image/196040f5-baa5-4edc-a1b3-eba54c434f11.jpg',
      alt: 'Moss Frame',
      price: '450.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: '[DÉ GARDEN] Kokedama Workshop',
      image: 'https://storage.googleapis.com/a1aa/image/f73c1884-b368-47da-1ac2-76fa1424442e.jpg',
      alt: 'Kokedama Workshop',
      price: '350.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: 'The “Traditional Water Puppet Show” - Múa rối nước',
      image: 'https://storage.googleapis.com/a1aa/image/d1c63d45-56a1-429b-05ee-dcd83fb1dd4e.jpg',
      alt: 'Water Puppet',
      price: '1.000.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: 'Chào Show',
      image: 'https://storage.googleapis.com/a1aa/image/7dfd1da7-b127-4dee-b57b-3e23e4d6a772.jpg',
      alt: 'Chào Show',
      price: '1.000.000đ',
      date: '16 tháng 06, 2025'
    },
    {
      title: 'PHẬT BẢO NGHIÊM TRẤN - TRIỂN LÃM DI SẢN PHẬT GIÁO...',
      image: 'https://storage.googleapis.com/a1aa/image/4c91f8b4-8e86-4418-3034-b93a570dff68.jpg',
      alt: 'Triển lãm Phật giáo',
      price: '1.000.000đ',
      date: '16 tháng 06, 2025'
    }
  ];
}
