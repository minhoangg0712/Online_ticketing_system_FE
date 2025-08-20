import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForyouEventComponent } from './foryou-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForyouEventComponent', () => {
  let component: ForyouEventComponent;
  let fixture: ComponentFixture<ForyouEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForyouEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForyouEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
