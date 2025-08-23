import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewTicketComponent } from './review-ticket.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ReviewTicketComponent', () => {
  let component: ReviewTicketComponent;
  let fixture: ComponentFixture<ReviewTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReviewTicketComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'id') return '123';
                return null;
              }
            }),
            params: of({ id: '123' }),
            queryParams: of({}),
            snapshot: { paramMap: { get: (key: string) => '123' } }
          }
        }
      ]
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
