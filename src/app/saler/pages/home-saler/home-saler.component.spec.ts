import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSalerComponent } from './home-saler.component';

describe('HomeSalerComponent', () => {
  let component: HomeSalerComponent;
  let fixture: ComponentFixture<HomeSalerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSalerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
