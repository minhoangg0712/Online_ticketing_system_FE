import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderCaptchaComponent } from './slider-captcha.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SliderCaptchaComponent', () => {
  let component: SliderCaptchaComponent;
  let fixture: ComponentFixture<SliderCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SliderCaptchaComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // nếu component dùng paramMap
            paramMap: of({
              get: (key: string) => (key === 'id' ? '123' : null)
            }),
            // nếu component dùng params
            params: of({ id: '123' }),
            // nếu component dùng queryParams
            queryParams: of({}),
            // nếu component dùng snapshot
            snapshot: { paramMap: { get: (key: string) => '123' } }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
