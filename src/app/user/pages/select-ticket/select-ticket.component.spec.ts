import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectTicketComponent } from './select-ticket.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SelectTicketComponent', () => {
  let component: SelectTicketComponent;
  let fixture: ComponentFixture<SelectTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTicketComponent,
        HttpClientTestingModule,
        RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 123 }) }   // 👈 mock param "id"
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
