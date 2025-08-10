import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermForUserComponent } from './term-for-user.component';

describe('TermForUserComponent', () => {
  let component: TermForUserComponent;
  let fixture: ComponentFixture<TermForUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermForUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermForUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
