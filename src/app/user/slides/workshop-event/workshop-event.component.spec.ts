import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopEventComponent } from './workshop-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkshopEventComponent', () => {
  let component: WorkshopEventComponent;
  let fixture: ComponentFixture<WorkshopEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopEventComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
