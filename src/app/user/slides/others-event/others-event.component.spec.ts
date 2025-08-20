import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OthersEventComponent } from './others-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OthersEventComponent', () => {
  let component: OthersEventComponent;
  let fixture: ComponentFixture<OthersEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OthersEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OthersEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
