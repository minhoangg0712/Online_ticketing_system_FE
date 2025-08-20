import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialEventComponent } from './special-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpecialEventComponent', () => {
  let component: SpecialEventComponent;
  let fixture: ComponentFixture<SpecialEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
