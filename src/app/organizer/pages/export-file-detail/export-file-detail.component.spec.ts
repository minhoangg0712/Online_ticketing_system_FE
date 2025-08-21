import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportFileDetailComponent } from './export-file-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ExportFileDetailComponent', () => {
  let component: ExportFileDetailComponent;
  let fixture: ComponentFixture<ExportFileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportFileDetailComponent], // vì bạn đang dùng Standalone Component
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),      // mock tham số route
            queryParams: of({}),            // mock query params nếu cần
            snapshot: { paramMap: { get: () => '123' } } // mock snapshot nếu dùng
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportFileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
