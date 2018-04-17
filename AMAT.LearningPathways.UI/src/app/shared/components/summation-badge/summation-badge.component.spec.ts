import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummationBadgeComponent } from './summation-badge.component';

describe('SummationBadgeComponent', () => {
  let component: SummationBadgeComponent;
  let fixture: ComponentFixture<SummationBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummationBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
