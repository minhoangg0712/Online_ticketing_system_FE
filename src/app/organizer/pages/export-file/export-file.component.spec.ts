import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExportFileComponent } from './export-file.component';

describe('ExportFileComponent', () => {
  let component: ExportFileComponent;
  let fixture: ComponentFixture<ExportFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportFileComponent, HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
