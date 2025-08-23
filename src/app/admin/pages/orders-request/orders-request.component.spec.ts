import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersRequestComponent } from './orders-request.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrdersRequestComponent', () => {
  let component: OrdersRequestComponent;
  let fixture: ComponentFixture<OrdersRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersRequestComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
