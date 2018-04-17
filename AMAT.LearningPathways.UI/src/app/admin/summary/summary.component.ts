import { Component, OnInit } from '@angular/core';
import { CurriculumService } from './../services/curriculum.service';
import { ICurriculum, ICourse } from './../services/ICurriculum';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import * as _ from 'lodash';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { EmployeeService } from '../../shared/services/employee.service';

@Component({
  selector: 'learningPathway-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  requiredCourseList: ICurriculum[];
  electiveCourseList: ICurriculum[];
  currentSelectedAdminRole: string;
  employeeFirstName: string;

  cutOffRequiredHour: number = 0
  constructor(private _service: CurriculumService, private _router: Router, private route: ActivatedRoute, private _employeeService: EmployeeService, private _toastr: NotificationService) {
    this._employeeService.employeeObservable.subscribe(
      (emp) => {
        if (emp) {
          this.employeeFirstName = emp.EmployeeName;
          //this.currentSelectedAdminRole = emp.Role_Name;
        }
      }
    );

    this.currentSelectedAdminRole = this._service.currentAdminRole;
  }

  ngOnInit() {

    let curriculumList = this._service.getdata();
    //this.currentSelectedAdminRole = this._service.CurrentAdminRole;
    this.cutOffRequiredHour = this._service.currentAdminRoleCutOffHour;
    this.requiredCourseList = curriculumList.filter(x => x.IsMandatory === true);

    this.electiveCourseList = curriculumList.filter(x => x.IsMandatory === false);
  }

  cutOffHourChange(val: number): void {
    this.cutOffRequiredHour = val;
    this._service.currentAdminRoleCutOffHour = val;

  }

  createPathway(e: any): void {
    e.preventDefault();
    if (this.requiredCourseList.length > 0 || this.electiveCourseList.length > 0) {

      this._service.createPathway(this.processResult.bind(this));
    }
    else {
      this._toastr.error("you must select atleast one foundational or elective course before creating the pathway !!", "Error creating pathway");
    }




  }
  goBack(e: any): void {
    e.preventDefault();
    this._router.navigate(['./../'], { relativeTo: this.route })

  }
  SaveCurriculum(e: any): void {
    e.preventDefault();
    if (this.requiredCourseList.length > 0 || this.electiveCourseList.length > 0) {

      this._service.saveCurriculum(this.processSaveResult.bind(this));
    }
    else {
      this._toastr.error("you must select atleast one foundational or elective course before creating the pathway !!", "Error creating pathway");
    }
  }


  private processSaveResult(result: boolean): void {
    if (result === true) {
      let roleUid = this._service.currentAdminRoleUID;
      if (sessionStorage.getItem(String(roleUid) + 'cutoff') !== null) {
        sessionStorage.removeItem(String(roleUid) + 'cutoff');
        sessionStorage.setItem(String(roleUid) + 'cutoff', String(this._service.currentAdminRoleCutOffHour));
      }

      this._toastr.success("Curriculum saved successfully !!");
    }
    else {
      this._toastr.error("Error saving curriculum. please contact support team!");
    }

  }
  private processResult(result: boolean): void {
    if (result === true) {
      this._router.navigate(['./../success'], { relativeTo: this.route });
    }
    else {
      this._toastr.error("error creating pathways !!");
    }

  }

  private processError(error: Response): void {
    let errorObj = { "status": error.status, "errorMessage": error.statusText };
    this._router.navigateByUrl('/error');

  }

  downloadCurriculum(e: any): void {
    let data = this._service.getdata();
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true
    };
    new Angular2Csv(data, 'My Report', options);
  }

}
