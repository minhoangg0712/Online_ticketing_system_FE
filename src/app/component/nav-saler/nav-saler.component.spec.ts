import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSalerComponent } from './nav-saler.component';

describe('NavSalerComponent', () => {
  let component: NavSalerComponent;
  let fixture: ComponentFixture<NavSalerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSalerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
