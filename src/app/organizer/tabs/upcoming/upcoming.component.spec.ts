import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingComponent } from './upcoming.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UpcomingComponent', () => {
  let component: UpcomingComponent;
  let fixture: ComponentFixture<UpcomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpcomingComponent,        
        HttpClientTestingModule    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
