import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedElectiveCourseComponent } from './selected-elective-course.component';

describe('SelectedElectiveCourseComponent', () => {
  let component: SelectedElectiveCourseComponent;
  let fixture: ComponentFixture<SelectedElectiveCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedElectiveCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedElectiveCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
