import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterOrganizerComponent } from './register-organizer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterOrganizerComponent', () => {
  let component: RegisterOrganizerComponent;
  let fixture: ComponentFixture<RegisterOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterOrganizerComponent, 
        HttpClientTestingModule     
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
