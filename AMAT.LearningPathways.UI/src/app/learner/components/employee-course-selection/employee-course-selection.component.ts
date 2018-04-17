import { Component, OnInit, SimpleChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ILearnerCurriculum, IEmployeeList } from '../../modal/ILearnerCurriculum';
import { LearnerCurriculumService } from '../../services/learner.service';
import { ILearnerSearchResult } from '../../modal/ILearnerSearchResult';
import { IEmployee } from '../../../admin/services/ICurriculum';
import { LearnerSkills } from '../../enum/learnerSkills.enum';
import { NotificationService } from '../../../shared/services/notification.service';
import { EmployeeService } from '../../../shared/services/employee.service'

@Component({
  selector: 'emp-course-selection',
  templateUrl: './employee-course-selection.component.html',
  styleUrls: ['./employee-course-selection.component.css']
})
export class EmployeeCourseSelectionComponent implements OnInit {

  @Output() approved = new EventEmitter();

  @Output() suggestChanges = new EventEmitter();

  @Input() inputCurrentEmployeeDetails: IEmployeeList = null;

  currentEmployee: IEmployeeList = null;

  currentEmployeeCoursesSelection: ILearnerCurriculum[] = [];

  foundationalCourseList: ILearnerCurriculum[] = [];
  functionalCourseList: ILearnerCurriculum[] = [];
  enrichmentCourseList: ILearnerCurriculum[] = [];
  totalSelectedCourseHours: number = 0;
  costOfEnrichmentCourses: number = 0;
  @ViewChild('msgModal') modalDialog;

  @ViewChild('msgModalApprove') approvModalDialog;
  localLearnerSkillsCopy: any = Object.assign({}, LearnerSkills);
  employeeList: IEmployeeList[] = []
  CurrentEmployeeDetails: IEmployeeList;
  comments: string = '';
  showAlter: boolean = false;
  hideSuggestChangesButton: boolean = false;
  hideApproveButton: boolean = false;


  constructor(private _toastr: NotificationService, private _employeeService: EmployeeService, private _learnerService: LearnerCurriculumService, private _lernerService: LearnerCurriculumService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentEmployee = this.inputCurrentEmployeeDetails;
    this.hideButton();
    this._learnerService.getCurrentEmployeeDetails(this.currentEmployee).subscribe(
      empDetails => {
        if (empDetails) {
          this.currentEmployeeCoursesSelection = empDetails
          this.functionalCourseList = Object.assign([], this.currentEmployeeCoursesSelection.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)]));
          this.foundationalCourseList = Object.assign([], this.currentEmployeeCoursesSelection.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)]));
          this.enrichmentCourseList = Object.assign([], this.currentEmployeeCoursesSelection.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)]));
          this.totalSelectedCourseHours = this._learnerService.getTotalHoursForSelectedCoursesForManager(this.functionalCourseList, this.foundationalCourseList, this.enrichmentCourseList);
          this.costOfEnrichmentCourses = this.calculateCostOfEncrichmentCourses(this.enrichmentCourseList);
        }
      }
    );
  }
  hideButton(): void {
    if (this.currentEmployee.IS_APPROVED === null) {
      this.hideApproveButton = true;
      this.hideSuggestChangesButton = true;
    }
    else if (this.currentEmployee.IS_APPROVED === false) {
      this.hideApproveButton = false;
      this.hideSuggestChangesButton = true;
    }
    else {
      this.hideApproveButton = false;
      this.hideSuggestChangesButton = false;
    }
  }


  calculateCostOfEncrichmentCourses(enrichmentCourses: ILearnerCurriculum[]): number {

    let enrichmentIncompeleteCourses: ILearnerCurriculum[];
    enrichmentIncompeleteCourses = Object.assign([], enrichmentCourses.filter(x => (x.IsCourseCompleted === false) && (x.IsEnrichmentCourse === true)));
    return ((enrichmentIncompeleteCourses.length) * 99);
  }
  ngOnInit(): void {

  }

  cancelPopUp(e: any): void {
    this.comments = '';
    this.hideDialog(e);
  }

  approve(e: any): void {
    this.approvModalDialog.show(e);
  }
  submitApprove(e: any): void {
    this.approvModalDialog.hide(e);
    this._learnerService.approveCourseSelection(this.inputCurrentEmployeeDetails, this.processApproveResult.bind(this));
  }

  closeApprove(e: any): void {
    this.approvModalDialog.hide(e);
  }

  private processApproveResult(result: boolean): void {
    if (result === true) {
      this._toastr.success("Approved successfully !")
      this.approved.emit();
      window.scrollTo(0, 0);
    }
    else {
      this._toastr.error("Error while sending suggested changes. please contact support team!");
    }

  }

  suggestChange(e: any): void {
    this.comments = '';
    this.showDialog(e);
  }

  submitComments(e: any): void {
    if (this.comments == '') {
      this.showAlter = true;
    }
    else {
      e.preventDefault();
      this.hideDialog(e);
      this._learnerService.submitSuggestChanges(this.inputCurrentEmployeeDetails, this.comments, this.processSubmitCommentsResult.bind(this));
    }
  }

  private processSubmitCommentsResult(result: boolean): void {
    if (result === true) {

      this.comments = '';
      this.showAlter = false;
      this._toastr.success("Suggested changes sent successfully..!");
      this.suggestChanges.emit();
      window.scrollTo(0, 0);
    }
    else {
      this._toastr.error("Error while sending suggested changes. please contact support team!");
    }

  }
  showDialog(e: any): void {
    this.modalDialog.show(e);
  }
  hideDialog(e: any): void {
    this.modalDialog.hide(e);
  }
  onFocus(e: any): void {
    this.showAlter = false;
  }
}
