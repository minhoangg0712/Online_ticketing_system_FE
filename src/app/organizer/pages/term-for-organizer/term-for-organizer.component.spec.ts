import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermForOrganizerComponent } from './term-for-organizer.component';

describe('TermForOrganizerComponent', () => {
  let component: TermForOrganizerComponent;
  let fixture: ComponentFixture<TermForOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermForOrganizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermForOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
