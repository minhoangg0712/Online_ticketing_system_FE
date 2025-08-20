import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderCaptchaComponent } from './slider-captcha.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SliderCaptchaComponent', () => {
  let component: SliderCaptchaComponent;
  let fixture: ComponentFixture<SliderCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderCaptchaComponent,
        HttpClientTestingModule]
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
