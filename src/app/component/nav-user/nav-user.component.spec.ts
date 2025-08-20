import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavUserComponent } from './nav-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NavUserComponent', () => {
  let component: NavUserComponent;
  let fixture: ComponentFixture<NavUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavUserComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
