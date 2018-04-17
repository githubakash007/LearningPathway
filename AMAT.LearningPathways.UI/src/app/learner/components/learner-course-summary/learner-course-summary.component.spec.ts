import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCourseSummaryComponent } from './learner-course-summary.component';

describe('LearnerCourseSummaryComponent', () => {
  let component: LearnerCourseSummaryComponent;
  let fixture: ComponentFixture<LearnerCourseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerCourseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerCourseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
