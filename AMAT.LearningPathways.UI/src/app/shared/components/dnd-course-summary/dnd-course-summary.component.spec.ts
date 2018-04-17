import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DndCourseSummaryComponent } from './dnd-course-summary.component';

describe('DndCourseSummaryComponent', () => {
  let component: DndCourseSummaryComponent;
  let fixture: ComponentFixture<DndCourseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DndCourseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DndCourseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
