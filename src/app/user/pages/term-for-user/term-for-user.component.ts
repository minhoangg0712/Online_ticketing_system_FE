import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-term-for-user',
  imports: [],
  templateUrl: './term-for-user.component.html',
  styleUrl: './term-for-user.component.css'
})
export class TermForUserComponent {
  pdfUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/dieu-khoan-khach-hang.pdf');
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
  }
}
