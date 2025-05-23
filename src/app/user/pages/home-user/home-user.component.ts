import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent  {
  images = [
    { src: '/assets/img1.jpg', alt: 'Image 1' },
    { src: '/assets/img2.jpg', alt: 'Image 2' },
    { src: '/assets/img3.jpg', alt: 'Image 3' },
    { src: '/assets/img4.jpg', alt: 'Image 4' }
  ];

  currentIndex = 0;
  transitionStyle = 'transform 0.5s ease-in-out';

  get visibleImages() {
    const total = this.images.length;
    const first = this.currentIndex % total;
    const second = (this.currentIndex + 1) % total;
    return [this.images[first], this.images[second]];
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  viewDetails(image: any): void {
    alert('Chi tiết: ' + image.alt);
  }

  get dotIndicators(): number[] {
    return Array(this.images.length).fill(0);
  }
}
