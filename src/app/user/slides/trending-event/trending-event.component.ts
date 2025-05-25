import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselItem {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-trending-event',
  imports: [CommonModule],
  templateUrl: './trending-event.component.html',
  styleUrl: './trending-event.component.css'
})
export class TrendingEventComponent implements OnInit {
  currentIndex = 0;
  maxIndex = 0;

  items: CarouselItem[] = [
    {
      image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Thần Điêu Xiệp Lữ',
      description: 'Phim cổ trang kiếm hiệp đặc sắc'
    },
    {
      image: 'https://images.unsplash.com/photo-1539571696329-a4293ba04d74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'ISAAC Love',
      description: 'Concert âm nhạc đặc biệt tháng này'
    },
    {
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Một Nhà',
      description: 'Show truyền hình gia đình ấm áp'
    },
    {
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Concert Music',
      description: 'Đêm nhạc đặc sắc cuối tuần'
    },
    {
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Phim Hành Động',
      description: 'Bom tấn Hollywood mới nhất'
    },
    {
      image: 'https://images.unsplash.com/photo-1489599363715-85e5266a0a4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Drama Korea',
      description: 'Series tình cảm hot nhất'
    }
  ];

  ngOnInit(): void {
    this.calculateMaxIndex();
  }

  calculateMaxIndex(): void {
    // Có thể scroll tối đa để hiện được các item còn lại
    this.maxIndex = Math.max(0, this.items.length - 3);
  }

  nextSlide(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  getTransformStyle(): string {
    const movePercent = this.currentIndex * 27; // 25% width + 2% gap
    return `translateX(-${movePercent}%)`;
  }

  isPrevDisabled(): boolean {
    return this.currentIndex === 0;
  }

  isNextDisabled(): boolean {
    return this.currentIndex >= this.maxIndex;
  }
}
