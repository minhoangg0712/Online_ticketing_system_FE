import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalRequestComponent } from './approval-request.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApprovalRequestComponent', () => {
  let component: ApprovalRequestComponent;
  let fixture: ComponentFixture<ApprovalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalRequestComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
