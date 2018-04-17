import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectiveCourseComponent } from './elective-course.component';

describe('ElectiveCourseComponent', () => {
  let component: ElectiveCourseComponent;
  let fixture: ComponentFixture<ElectiveCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectiveCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectiveCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
