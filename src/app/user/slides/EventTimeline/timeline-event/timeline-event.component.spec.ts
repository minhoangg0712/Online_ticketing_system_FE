import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineEventComponent } from './timeline-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TimelineEventComponent', () => {
  let component: TimelineEventComponent;
  let fixture: ComponentFixture<TimelineEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
