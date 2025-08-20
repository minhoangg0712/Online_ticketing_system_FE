import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchEventsComponent } from './search-events.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchEventsComponent', () => {
  let component: SearchEventsComponent;
  let fixture: ComponentFixture<SearchEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEventsComponent,
        HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),  // nếu component dùng params
            queryParams: of({}), // nếu dùng queryParams
            snapshot: { paramMap: { get: () => null } } // nếu dùng snapshot
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
