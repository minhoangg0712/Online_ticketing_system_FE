import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-term-for-organizer',
  imports: [],
  templateUrl: './term-for-organizer.component.html',
  styleUrls: ['./term-for-organizer.component.css'],
})
export class TermForOrganizerComponent {
  pdfUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/dieu-khoan.pdf');
  }
}
