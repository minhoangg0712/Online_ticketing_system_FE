import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivemusicEventComponent } from './livemusic-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LivemusicEventComponent', () => {
  let component: LivemusicEventComponent;
  let fixture: ComponentFixture<LivemusicEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivemusicEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivemusicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
