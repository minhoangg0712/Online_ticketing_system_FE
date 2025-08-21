import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OngoingComponent } from './ongoing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OngoingComponent', () => {
  let component: OngoingComponent;
  let fixture: ComponentFixture<OngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OngoingComponent,         
        HttpClientTestingModule    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
