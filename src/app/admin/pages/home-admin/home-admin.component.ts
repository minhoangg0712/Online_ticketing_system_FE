import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../component/admin/footer/footer.component';
import { HeaderComponent } from '../../../component/admin/header/header.component';
import { SidebarComponent } from '../../../component/admin/sidebar/sidebar.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'],
})
export class HomeAdminComponent implements OnInit, OnDestroy {
  private cssFiles = [
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
    '/assets/plugins/fontawesome-free/css/all.min.css',
    'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
    '/assets/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
    '/assets/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
    '/assets/plugins/jqvmap/jqvmap.min.css',
    '/assets/dist/css/adminlte.min.css',
    '/assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
    '/assets/plugins/daterangepicker/daterangepicker.css',
    '/assets/plugins/summernote/summernote-bs4.min.css',
  ];

  private jsFiles = [
    '/assets/plugins/jquery/jquery.min.js',
    '/assets/plugins/jquery-ui/jquery-ui.min.js',
    '/assets/plugins/bootstrap/js/bootstrap.bundle.min.js',
    '/assets/plugins/moment/moment.min.js',
    '/assets/plugins/daterangepicker/daterangepicker.js',
    '/assets/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
    '/assets/plugins/chart.js/Chart.min.js',
    '/assets/plugins/sparklines/sparkline.js',
    '/assets/plugins/jqvmap/jquery.vmap.min.js',
    '/assets/plugins/jqvmap/maps/jquery.vmap.usa.js',
    '/assets/plugins/jquery-knob/jquery.knob.min.js',
    '/assets/plugins/summernote/summernote-bs4.min.js',
    '/assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
    '/assets/dist/js/adminlte.js',
    '/assets/dist/js/pages/dashboard.js',
  ];

  private elements: HTMLElement[] = [];

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Load CSS
    this.cssFiles.forEach(css => {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.setAttribute(link, 'href', css);
      this.renderer.appendChild(this.document.head, link);
      this.elements.push(link);
    });

    // Load JS theo thứ tự
    this.loadScriptsSequentially(this.jsFiles, () => {
      // Sau khi load xong JS, khởi tạo AdminLTE
      setTimeout(() => {
        const $ = (window as any).$;
        if ($) {
          $.widget?.bridge('uibutton', $.ui.button);
          $('[data-widget="treeview"]').Treeview?.('init');
          $('[data-widget="pushmenu"]').PushMenu?.();
        }
      }, 300);
    });
  }

  private loadScriptsSequentially(files: string[], callback: () => void) {
    const loadNext = (index: number) => {
      if (index >= files.length) {
        callback();
        return;
      }
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'src', files[index]);
      script.onload = () => loadNext(index + 1);
      this.renderer.appendChild(this.document.body, script);
      this.elements.push(script);
    };
    loadNext(0);
  }

  ngOnDestroy(): void {
    // Xóa các phần tử đã thêm để tránh rò rỉ bộ nhớ
    this.elements.forEach(element => {
      if (element.parentNode) {
        this.renderer.removeChild(element.parentNode, element);
      }
    });
    this.elements = [];
  }
}
 