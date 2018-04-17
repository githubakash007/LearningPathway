import { Component, OnInit, ViewChild } from '@angular/core';
import { IEmployeeList } from '../../modal/ILearnerCurriculum';
import { NotificationService } from '../../../shared/services/notification.service';
import { LearnerCurriculumService } from '../../services/learner.service';
import { EmployeeService } from '../../../shared/services/employee.service'
import { IEmployee } from '../../../admin/services/ICurriculum';


@Component({
  selector: 'manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {


  hideEmployeeList: boolean = false;
  hideEmployeeCourseSelection: boolean = true;
  pendingApprovalCount: number = 0;
  employeeList: IEmployeeList[] = []
  CurrentEmployeeDetails: IEmployeeList;
  totalEmployeeCount: number = 0;
  totalCost: number = 0;

  constructor(private _toastr: NotificationService, private _learnerService: LearnerCurriculumService, private _lernerService: LearnerCurriculumService, private _employeeService: EmployeeService) {

    this._employeeService.employeeObservable.subscribe(
      (emp) => {
        if (emp) {
          this.pendingApprovalCount = emp.PENDING_APPROVAL_COUNT;
        }
      }
    );
  }

  ngOnInit(): void {
    this._lernerService.getEmployeeListForApproval().subscribe(
      emp => {
        if (emp) {
          this._learnerService.setEmployeeListForApproval(emp)
          this.employeeList = emp;
          this.totalEmployeeCount = this.employeeList.length;
          this.totalCost = this.calculateTotalCost(this.employeeList);
        }
      }
    );

  }

  calculateTotalCost(employeeList: IEmployeeList[]): number {
    let totalCost: number = 0;

    if (employeeList != undefined && employeeList.length > 0) {
      totalCost = employeeList.reduce(((sum, val) => sum += val.TOTAL_PATHWAY_COST), 0)
    }
    return totalCost;
  }

  getEmployeeCourseSelection(emp: IEmployeeList): void {
    this.hideEmployeeList = true;
    this.hideEmployeeCourseSelection = false;
    this.CurrentEmployeeDetails = emp;
  }

  goBackToEmployeeList(): void {
    this.hideEmployeeList = false;
    this.hideEmployeeCourseSelection = true;
  }

  goBackToLearner(): void {
  }

  updateEmployeeListForApporval(e: any) {

    this.hideEmployeeCourseSelection = true;
    this.hideEmployeeList = false;
    this.pendingApprovalCount = this.pendingApprovalCount - 1;

    let employeeObj: IEmployee = this._employeeService.employeeSource.getValue();
    employeeObj.PENDING_APPROVAL_COUNT = this.pendingApprovalCount;
    this._employeeService.employeeSource.next(employeeObj);
    this.employeeList.find(x => x.EMPLOYEE_ID === this.CurrentEmployeeDetails.EMPLOYEE_ID).IS_APPROVED = true;
    this._lernerService.setEmployeeListForApproval(this.employeeList);

  }

  updateEmployeeListForSuggestChanges(e: any) {

    this.hideEmployeeCourseSelection = true;
    this.hideEmployeeList = false;
    this.pendingApprovalCount = this.pendingApprovalCount - 1;

    let employeeObj: IEmployee = this._employeeService.employeeSource.getValue();
    employeeObj.PENDING_APPROVAL_COUNT = this.pendingApprovalCount;
    this._employeeService.employeeSource.next(employeeObj);
    this.employeeList.find(x => x.EMPLOYEE_ID === this.CurrentEmployeeDetails.EMPLOYEE_ID).IS_APPROVED = false;
    this._lernerService.setEmployeeListForApproval(this.employeeList);
  }
}
