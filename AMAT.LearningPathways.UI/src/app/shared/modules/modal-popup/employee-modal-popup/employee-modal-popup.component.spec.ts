import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeModalPopupComponent } from './employee-modal-popup.component';

describe('EmployeeModalPopupComponent', () => {
  let component: EmployeeModalPopupComponent;
  let fixture: ComponentFixture<EmployeeModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
