import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewTicketComponent } from './review-ticket.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReviewTicketComponent', () => {
  let component: ReviewTicketComponent;
  let fixture: ComponentFixture<ReviewTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTicketComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
