import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderTicketComponent } from './order-ticket.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderTicketComponent', () => {
  let component: OrderTicketComponent;
  let fixture: ComponentFixture<OrderTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTicketComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
