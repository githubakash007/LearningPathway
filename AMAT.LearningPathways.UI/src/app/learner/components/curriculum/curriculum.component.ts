import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
import { LearnerCurriculumService } from '../../services/learner.service';
import { EmployeeService } from '../../../shared/services/employee.service';
import { LearnerSkills } from '../../enum/learnerSkills.enum';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { AppStateService } from '../../../shared/services/appstate.service';

import { ModalDialogService } from '../../../shared/modules/modal-popup/modal-dialog.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ISearchCriteria } from '../../../admin/modal/ISearchCriteria';
import { ILearnerSearchResult } from '../../modal/ILearnerSearchResult';
import { ValidationMessageType } from '../../enum/validationMessageType.enum';
import { NotificationService } from '../../../shared/services/notification.service';



import { maxFoundationalElectiveCourseCount } from './../../constants/learner.constant';
import { ISearchResult } from '../../../admin/services/ICurriculum';
declare let $: any;


@Component({
  selector: 'learner-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {

  private searchKeyChanged: BehaviorSubject<ISearchCriteria> = new BehaviorSubject<ISearchCriteria>({ "searchBy": '', "searchKey": '', "skillId": '' });

  learnerCurriculumList: ILearnerCurriculum[] = [];
  foundationCurriculumList: ILearnerCurriculum[] = [];
  funcCurriculumList: ILearnerCurriculum[] = [];
  enrichmentCurriculumList: ILearnerCurriculum[] = [];
  welcomeMessage: string = '';
  currentEmployeeName: string = '';
  employeeRoleName: string = '';
  foundationElectiveCourseCount: number = 0;
  functionalElectiveCourseCount: number = 0;

  currentSelectedFoundationalCoursesCount: number = 0;
  currentSelectedFunctionalCoursesCount: number = 0;

  showWelcomeDialog: boolean = true;

  @ViewChild('msgModal') modalDialog;

  @ViewChild('validationMsgModal') validationMsgModal;

  @ViewChild('modal') courseDetailModalDialog;

  localLearnerSkillsCopy: any = Object.assign({}, LearnerSkills);

  //added by sandeep
  isLoading: boolean = false;
  searchString: string;
  searchResult: ILearnerSearchResult[] = [];
  showModalDialog: boolean = false;
  validationMsg: string = '';
  totalSelectedCourseHours: number = 0;
  maxHours: number = 0;

  constructor(private _router: Router, private _toastr: NotificationService, private route: ActivatedRoute, private _appState: AppStateService, private _learnerService: LearnerCurriculumService, private _employeeService: EmployeeService) {



    //this.learnerCurriculumList = this._learnerService.getCurrentCourseFromStore();
    //this._learnerService.electiveCourseCount = this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)]).length;
    this._learnerService.setInitialValue();
    this.foundationElectiveCourseCount = this._learnerService.totalFoundationalElectiveCount;
    this.functionalElectiveCourseCount = this._learnerService.totalFunctionalElectiveCount;


    this.searchKeyChanged
      .debounceTime(1000)
      .filter(searchCriteria => searchCriteria !== undefined && searchCriteria !== null || searchCriteria.searchKey !== '')
      .distinctUntilChanged((x, y) => { this.isLoading = x === y ? false : this.isLoading; return x === y })
      .switchMap(searchCriteria => searchCriteria !== undefined && searchCriteria !== null && searchCriteria.searchKey ?
        this._learnerService.getSearchResult(searchCriteria) :
        Observable.of(null)
      )
      .subscribe(items => {
        this.searchResult = items || [];

        this.isLoading = false;
      });

  }

  ngOnInit() {

    this._appState.learnerPathwaySubmittedObservable.subscribe(val => {
      if (val) {
        this._router.navigate(['./../summary'], { relativeTo: this.route });
      }
    });

    this._employeeService.employeeObservable.subscribe(emp => {
      this.currentEmployeeName = emp.EmployeeName;
      this.employeeRoleName = emp.Role_Name;
    }
    );

    this._learnerService.learnerCurriculumListObservable.subscribe(curriculumList => {
      if (curriculumList) {

        this.funcCurriculumList = Object.assign([], curriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)]));
        this.foundationCurriculumList = Object.assign([], curriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)]));
        this.enrichmentCurriculumList = Object.assign([], curriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)]));

        this.currentSelectedFoundationalCoursesCount = this.foundationCurriculumList.filter(x => x.IsMandatory === false && x.IsSelected === true).length;
        this.currentSelectedFunctionalCoursesCount = this.funcCurriculumList.filter(x => x.IsMandatory === false && x.IsSelected === true).length;
        this._learnerService.selectedFunctionalElectiveCourseCount = this.currentSelectedFunctionalCoursesCount;
        this._learnerService.selectedFoundationalElectiveCourseCount = this.currentSelectedFoundationalCoursesCount;
        //this.getFunctionalFoundationalCount(this.funcCurriculumList,this.foundationCurriculumList);
        //this.getTotalSelectedCourseHours(this.funcCurriculumList,this.foundationCurriculumList,this.enrichmentCurriculumList);
      }
    });

  }


  ngAfterContentInit(): void {
    let prevUrl = this._learnerService.prevUrl;
    let currentUrl = this._learnerService.currentUrl;
    if (prevUrl && currentUrl && prevUrl === '/learner/summary' && currentUrl === '/learner/curriculum') {
      this.modalDialog.hide();
    }
    else {
      this.modalDialog.show();
    }
  }

  showDialog(e: any): void {
    this.modalDialog.show(e);
  }

  hideDialog(e: any): void {
    this.modalDialog.hide(e);
  }

  showValidationDialog(e: any): void {
    this.validationMsgModal.show(e);
  }

  hideValidationDialog(e: any): void {
    this.validationMsgModal.hide(e);
  }

  canUserProceed(skill: string): boolean {

    let proceed: boolean = false;

    let exaustMaxHours = this._learnerService.getTotalHoursForSelectedCourses() >= this._learnerService.maxAllowedHours;

    if (exaustMaxHours) {
      return true;
    }
    else {
      proceed = this.isTabCompleted(skill);
    }

    return proceed;

  }

  isTabCompleted(skill: string): boolean {
    let courseCount: number;
    let proceed: boolean = false;

    if (this._learnerService.getTotalHoursForSelectedCourses() >= this._learnerService.maxAllowedHours) {
      proceed = true;
    }
    else {

      if (LearnerSkills[LearnerSkills.Foundational].toString() === skill) {
        courseCount = this.getRequiredElectiveCourseCount(this.foundationElectiveCourseCount);
        proceed = courseCount === this.currentSelectedFoundationalCoursesCount;
      }
      // else if (LearnerSkills[LearnerSkills.Functional].toString() === skill) {
      //   courseCount = this.getRequiredElectiveCourseCount(this.functionalElectiveCourseCount)
      //   proceed = courseCount === this.currentSelectedFunctionalCoursesCount;
      // }
    }

    return proceed;
  }

  //Will optimize the below two function later.
  navigateTab(e: any, goToSkillId: number): void {

    e.preventDefault();
    if (goToSkillId === LearnerSkills.Enrichment) {
      $('#pathwayLearnerTab li#lifoundational').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
      $('#pathwayLearnerTab li#lifunctional').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
      $('#pathwayLearnerTab li#lienrichment').addClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "true");
      $('#pathwayLearnerTabContent div#foundational').removeClass('active');
      $('#pathwayLearnerTabContent div#functional').removeClass('active');
      $('#pathwayLearnerTabContent div#enrichment').addClass('active');
    }
    else if (goToSkillId === LearnerSkills.Functional) {
      $('#pathwayLearnerTab li#lifoundational').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
      $('#pathwayLearnerTab li#lienrichment').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
      $('#pathwayLearnerTab li#lifunctional').addClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "true");
      $('#pathwayLearnerTabContent div#foundational').removeClass('active');
      $('#pathwayLearnerTabContent div#enrichment').removeClass('active');
      $('#pathwayLearnerTabContent div#functional').addClass('active');

    }
    window.scrollTo(0, 0);

  }

  navigateBack(e: any): void {

    // e.preventDefault();
    // $('#pathwayTab li.active').prev().find('a[data-toggle="tab"]').click();
    e.preventDefault();
    $('#pathwayTab li#lifoundational').addClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "true");
    $('#pathwayTab li#lifunctional').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
    $('#pathwayTabContent div#foundational').addClass('active');
    $('#pathwayTabContent div#functional').removeClass('active');
    window.scrollTo(0, 0);
  }

  getRequiredElectiveCourseCount(arr: number): number {
    let count = 0;
    count = this._learnerService.getFiftyPercentageOfElectiveCourses(arr);
    return count;
  }

  searchCourses(searchCriteria: ISearchCriteria): void {
    if (searchCriteria && searchCriteria.searchKey
      && !(_.isEqual(this.searchKeyChanged.getValue(), searchCriteria))) {
      this.searchString = searchCriteria.searchKey;
      this.isLoading = true;
      this.searchKeyChanged.next(searchCriteria);
    }

  }

  addCourseFromSearch(course: ILearnerSearchResult): void {

    let result: ValidationMessageType = this._learnerService.allowFunctionalCourse();
    if (result === ValidationMessageType.additionIsValid) {
      this._learnerService.addNewFunctionalCourseFromSearchResult(course, this.processResult.bind(this));
    }
    else {
      this.createValidationMessage(result);
      this.showValidationDialog(undefined);
    }
  }

  private createValidationMessage(messageType: ValidationMessageType): any {

    if (messageType === ValidationMessageType.funcFoundNotCountCompleted) {

      document.getElementById("validationMsgPopup").innerHTML =
        `You cannot add functional courses before adding required number of foundational electives for your pathway.`;
    }
    else if (messageType === ValidationMessageType.reachedMaxAllowedHours) {
      document.getElementById("validationMsgPopup").innerHTML = `You have already reached the max allowed duration of ${this._learnerService.maxAllowedHours} hours.`
    }
  }

  processResult(result: boolean, isCourseExist: boolean): void {
    this.courseDetailModalDialog.hide();
    if (isCourseExist) {
      this._toastr.info("Course already added!. Please choose another course !!");
    }
    else {
      if (result === true) {
        this._toastr.success("Course added successfully !");
      }
      else {
        this._toastr.error(`Adding new course has failed. please contact the support team !!`);
      }

    }

  }

  showCourseDetailPopup(course: ISearchResult): void {
    if (course.IsCourseCompleted === true || course.IsSelected === true) {
      // modal.show(undefined,$event.CourseId,true,addCourseFromSearch.bind(this,$event),$event.IsMandatory)"
      this.courseDetailModalDialog.show(undefined, course.CourseId, false, this.addCourseFromSearch.bind(this, course), course.IsMandatory);
    }
    else {
      this.courseDetailModalDialog.show(undefined, course.CourseId, true, this.addCourseFromSearch.bind(this, course), course.IsMandatory);
    }
  }


}
