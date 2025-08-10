import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dispute-resolution',
  imports: [],
  templateUrl: './dispute-resolution.component.html',
  styleUrl: './dispute-resolution.component.css'
})
export class DisputeResolutionComponent {
   pdfUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/Cơ chế giải quyết tranh chấp_khiếu nại.pdf');
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
  }
}
