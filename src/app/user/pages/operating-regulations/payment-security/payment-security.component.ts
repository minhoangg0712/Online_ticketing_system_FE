import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-security',
  imports: [],
  templateUrl: './payment-security.component.html',
  styleUrl: './payment-security.component.css'
})
export class PaymentSecurityComponent {
  pdfUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/CHÍNH SÁCH BẢO MẬT THANH TOÁN.pdf');
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
  }
}
