import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { LearnerCurriculumService } from '../../services/learner.service';
import { EmployeeService } from '../../../shared/services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
import { LearnerSkills } from '../../enum/learnerSkills.enum';
import * as _ from 'lodash';
import { LearningEnv } from '../../../shared/enum/LearningEnv.enum';
import { PathwayStatus } from '../../enum/pathwayStatus.enum';
import { MessageType } from '../../../shared/enum/messageType.enum';
import { AppStateService } from '../../../shared/services/appstate.service';
import { IEmployee } from '../../../admin/services/ICurriculum';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class LearnerSummaryComponent implements OnInit {

  currentEmployeeName: string = '';
  employeeRoleName: string = '';
  ispathwayApproved: boolean;
  isCurriculumDefault: boolean;
  messageType: string = '';
  pathwayStatus: string = '';
  totalSelectedCourseHours: number = 0;
  totalSelectedCourseCost: number = 0;
  maxHours: number = 0;
  foundationalCourseList: ILearnerCurriculum[] = [];
  functionalCourseList: ILearnerCurriculum[] = [];
  enrichmentCourseList: ILearnerCurriculum[] = [];
  showSubmit: boolean = true;
  showNote: boolean = false;
  @ViewChild('msgModal') modalDialog;
  @ViewChild('resetMsgModal') resetModalDialog;
  submitValidationMsg: string = '';
  resetConfirmationMsg; string = '';

  constructor(private _learnerService: LearnerCurriculumService, private _employeeService: EmployeeService,
    private _router: Router, private route: ActivatedRoute, private _appState: AppStateService, private _toastr: NotificationService) {

  }

  ngOnInit() {
    this.removeClass();

    this._appState.learnerPathwaySubmittedObservable.subscribe(val => {
      this.showSubmit = !val;
    });

    this._employeeService.employeeObservable.subscribe(emp => {
      this.currentEmployeeName = emp.EmployeeName;
      emp.IS_DEFAULT === true ? this.employeeRoleName = emp.DEFAULT_ROLE_NAME : this.employeeRoleName = emp.Role_Name;
      this.ispathwayApproved = emp.IsPathwayApproved;
      this.isCurriculumDefault = emp.IS_DEFAULT;

    }
    );

    this.getPathwayStatus();

    let curriculumList: ILearnerCurriculum[] = _.orderBy(this._learnerService.getLearnerCurriculum().filter(x => x.IsCourseCompleted === false), "IsMandatory", "desc");
    this.showNote = this.isClassRoomOrEnrichmentCourse(curriculumList);
    this.foundationalCourseList = _.orderBy(curriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)] && (x.IsMandatory === true || x.IsSelected === true)), "CourseId", "asc");
    this.functionalCourseList = _.orderBy(curriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)] && (x.IsMandatory === true || x.IsSelected === true)), "CourseId", "asc");
    this.enrichmentCourseList = _.orderBy(curriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)] && x.IsSelected === true), "CourseId", "asc");
    this.totalSelectedCourseHours = this._learnerService.getTotalHoursForSelectedCourses();
    this.totalSelectedCourseCost = this._learnerService.getTotalCostForSelectedCourses();
    this.maxHours = this._learnerService.maxAllowedHours;
  }

  private removeClass(): void {
    let isClassExist = document.body.classList.contains('modal-open');
    if (isClassExist) {
      document.body.className = document.body.className.replace('modal-open', '');
    }

  }

  private getPathwayStatus(): void {
    let status: PathwayStatus;
    let message: MessageType;
    switch (this.ispathwayApproved) {
      case null:
        status = PathwayStatus.pending;
        message = MessageType.info;
        break;
      case true:
        status = PathwayStatus.approved;
        message = MessageType.success;
        break;
      case false:
        status = PathwayStatus.rejected;
        message = MessageType.error;
        break;
    }
    this.messageType = message.toString();
    this.pathwayStatus = status.toString();
    //return status.toString();

  }

  goToHomePage(status: boolean): void {
    if (status) {
      let employeeObj: IEmployee = this._employeeService.employeeSource.getValue();
      if (employeeObj) {
        employeeObj.IS_DEFAULT = false;
        this._employeeService.employeeSource.next(employeeObj);
      }
      this._router.navigate(['/learner']);
      this._appState.IsPathwaySubmitted(false);

    }

  }

  resetPathway(e: any): void {
    e.preventDefault();
    this._learnerService.resetLearnerPathway(this.goToHomePage.bind(this));
  }

  

  confirmResetPathway(e: any): void {
    this.resetConfirmationMsg = `You are about to reset your pathway selection. Please note that this will trigger the process again, and notify your manager again for approval. Please make sure that the changes you make are necessary before continuing.`;
    this.resetModalDialog.show();

  }

  cancelReset(e: any): void {
    this.resetModalDialog.hide(e);
  }

  goBack(e: any): void {
    e.preventDefault();
    this._router.navigate(['/learner/curriculum']);//, { relativeTo: this.route })

  }
  submitCurriculum(e: any): void {
    e.preventDefault();
    this._learnerService.submitCurriculum(this.processSaveResult.bind(this), this.processValidationFaliour.bind(this));
  }


  private processSaveResult(result: boolean): void {
    if (result === true) {
      this.showSubmit = false;
      this.pathwayStatus = PathwayStatus.pending.toString();
      this.messageType = MessageType.info.toString();
      this._toastr.success("Curriculum saved successfully !!");
      window.scrollTo(0, 0);
    }
    else {
      this.showSubmit = true;
      this._toastr.error("Error saving curriculum. please contact support team!");
    }

  }

  private processValidationFaliour(msg: string): void {
    //this.submitValidationMsg = `Please add required ${this._learnerService.maxAllowedHours} hrs of courses into your pathways before submitting it`;
    this.submitValidationMsg = msg;
    this.modalDialog.show();
  }

  isClassRoomOrEnrichmentCourse(inputArr: ILearnerCurriculum[]): boolean {
    let found = inputArr.find(x => x.IsSelected === true && (x.LearningEnv === LearningEnv.Classroom.toString() || (x.Skill === LearnerSkills[(LearnerSkills.Enrichment)])));
    return found === undefined ? false : true;
  }

  showDialog(e: any): void {
    this.modalDialog.show(e);
  }

  hideDialog(e: any): void {
    this.modalDialog.hide(e);
  }

}
