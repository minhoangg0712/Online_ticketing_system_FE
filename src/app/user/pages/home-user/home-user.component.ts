import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingEventComponent } from '../../slides/trending-event/trending-event.component';
import { ForyouEventComponent } from '../../slides/foryou-event/foryou-event.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule, TrendingEventComponent, ForyouEventComponent, HttpClientModule],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit {

  // ==== Image Data ====
  images = [
    { src: '/assets/img1.jpg', alt: 'Image 1' },
    { src: '/assets/img2.jpg', alt: 'Image 2' },
    { src: '/assets/img3.jpg', alt: 'Image 3' },
    { src: '/assets/img4.jpg', alt: 'Image 4' }
  ];

  slideImages = [
    { src: '/assets/img1.jpg', alt: 'Lê Chí Vinh' },
    { src: '/assets/img2.jpg', alt: 'Isaac with Love' },
    { src: '/assets/img3.jpg', alt: 'Ba ơi Tha ơi Con Nhớ Cha' },
    { src: '/assets/img4.jpg', alt: 'Future with AI' },
    { src: '/assets/img1.jpg', alt: 'Mùa Em' },
    { src: '/assets/img2.jpg', alt: 'Mùa Em' },
    { src: '/assets/img3.jpg', alt: 'Mùa Em' },
    { src: '/assets/img4.jpg', alt: 'Mùa Em' }
  ];

  // ==== Slide Control State ====
  currentIndex = 0;
  slideCurrentIndex = 0;
  transitionStyle = 'transform 0.5s ease-in-out';
  itemWidth = 315;
  maxIndex = this.slideImages.length - 4; // Show 4 items

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // ==== Getters ====
  get visibleImages() {
    const total = this.images.length;
    const first = this.currentIndex % total;
    const second = (this.currentIndex + 1) % total;
    return [this.images[first], this.images[second]];
  }

  get dotIndicators(): number[] {
    return Array(this.images.length).fill(0);
  }

  get canSlideLeft(): boolean {
    return this.slideCurrentIndex > 0;
  }

  get canSlideRight(): boolean {
    return this.slideCurrentIndex < this.maxIndex;
  }

  get translateX(): number {
    return -this.slideCurrentIndex * this.itemWidth;
  }

  // ==== Methods ====
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  slideLeft(): void {
    if (this.canSlideLeft) {
      this.slideCurrentIndex--;
    }
  }

  slideRight(): void {
    if (this.canSlideRight) {
      this.slideCurrentIndex++;
    }
  }

  viewDetails(image: any): void {
    alert('Chi tiết: ' + image.alt);
  }
}
