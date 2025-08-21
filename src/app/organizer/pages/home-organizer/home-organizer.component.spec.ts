import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeOrganizerComponent } from './home-organizer.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeOrganizerComponent', () => {
  let component: HomeOrganizerComponent;
  let fixture: ComponentFixture<HomeOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOrganizerComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),  
            queryParams: of({}),        
            snapshot: { paramMap: { get: () => '123' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
