import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThisweekendEventComponent } from './thisweekend-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ThisweekendEventComponent', () => {
  let component: ThisweekendEventComponent;
  let fixture: ComponentFixture<ThisweekendEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThisweekendEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThisweekendEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
