import { Component, OnInit, SimpleChanges, Input, ViewChild } from '@angular/core';
import { ISearchCriteria } from '../../../admin/modal/ISearchCriteria';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../../../shared/services/notification.service';
import { LearnerCurriculumService } from '../../services/learner.service';
import { ModalDialogService } from '../../../shared/modules/modal-popup/modal-dialog.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import * as _ from 'lodash';
import { ILearnerSearchResult } from '../../modal/ILearnerSearchResult';
import { ValidationMessageType } from '../../enum/validationMessageType.enum';
import { ISearchResult } from '../../../admin/services/ICurriculum';

declare let $: any;

@Component({
  selector: 'enrichment-courses',
  templateUrl: './enrichment.component.html',
  styleUrls: ['./enrichment.component.css']
})
export class EnrichmentComponent implements OnInit {

  private searchKeyChanged: BehaviorSubject<ISearchCriteria> = new BehaviorSubject<ISearchCriteria>({ "searchBy": '', "searchKey": '', "skillId": '' });
  enrichmentCourseList: ILearnerCurriculum[] = [];
  selectedEnrichmentCourseList: ILearnerCurriculum[] = [];
  //historyList: IHistoryCurriculum[];
  @Input() skillId;
  @Input() inputEnrichmentCourses: ILearnerCurriculum[] = [];

  isLoading: boolean = false;
  searchString: string;
  searchResult: ILearnerSearchResult[] = [];
  showModalDialog: boolean = false;
  currentSelectedAdminRole: string;
  employeeName: string;
  validationMsg: string = '';
  totalSelectedCourseHours: number = 0;
  maxHours: number = 0;
  @ViewChild('modal') courseDetailModalDialog;
  @ViewChild('msgModal') msgModal;


  constructor(private _toastr: NotificationService, private _learnerService: LearnerCurriculumService, private _lernerService: LearnerCurriculumService, private _modalService: ModalDialogService) {

    
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



  ngOnChanges(changes: SimpleChanges): void {
    this.enrichmentCourseList = _.orderBy(this.inputEnrichmentCourses.filter(x => x.IsSelected === false), "CourseId", "asc");
    this.selectedEnrichmentCourseList = _.orderBy(this.inputEnrichmentCourses.filter(x => x.IsSelected === true), "CourseId", "asc");
    this.totalSelectedCourseHours = this._lernerService.getTotalHoursForSelectedCourses();
    this.maxHours = this._lernerService.maxAllowedHours;
  }
  ngOnInit(): void {
    // this._lernerService.getEnrichmentCourses().subscribe(
    //   val => this.enrichmentCourseList = val
    // );

  }

  searchCourses(searchCriteria: ISearchCriteria): void {
    if (searchCriteria && searchCriteria.searchKey
      && !(_.isEqual(this.searchKeyChanged.getValue(), searchCriteria))) {
      this.searchString = searchCriteria.searchKey;
      this.isLoading = true;
      this.searchKeyChanged.next(searchCriteria);
    }

  }

  AddEnrichmentCourse(e: any, course: ILearnerCurriculum): void {
    let result: ValidationMessageType = this._learnerService.allowEnrichmnetCourse();
    if (result === ValidationMessageType.additionIsValid) {
      this._lernerService.addEnrichmentCourse(course, this.processResultWithMessage.bind(this));
    } else {
      this.createValidationMessage(result);
      this.showDialog(undefined);
    }

    this.hideTooltip(e);


  }

  addCourseFromSearch(course: ILearnerSearchResult): void {

    let result: ValidationMessageType = this._learnerService.allowEnrichmnetCourse();
    if (result === ValidationMessageType.additionIsValid) {
      this._learnerService.addNewEnrichmentCourseFromSearchResult(course, this.processResult.bind(this));
    }
    else {
      this.createValidationMessage(result);
      this.showDialog(undefined);
    }
  }

  deleteCourse(e: any, course: ILearnerCurriculum): void {
    this._lernerService.deleteElectiveCourse(course, e, this.processDeleteResult.bind(this));
    //this.hideTooltip(e);
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  private createValidationMessage(messageType: ValidationMessageType): any {

    if (messageType === ValidationMessageType.funcFoundNotCountCompleted) {

      //   document.getElementById("validationPopup").innerHTML = 
      //   `You cannot add enrichment courses before adding required number of foundational and functional electives for your pathway`;
      // }

      document.getElementById("validationPopup").innerHTML =
        `You cannot add enrichment courses before adding required number of foundational electives for your pathway`;
    }
    else if (messageType === ValidationMessageType.reachedMaxAllowedHours) {
      document.getElementById("validationPopup").innerHTML = `You have already reached the max allowed duration of ${this._learnerService.maxAllowedHours} hours.`
    }
  }

  processResultWithMessage(result: boolean, message: string): void {
    this.courseDetailModalDialog.hide();
    if (result === true) {
      this._toastr.success("Course added successfully !");
    }
    else {

      this._toastr.error(message);
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

  processDeleteResult(result: boolean, e: any): void {
    this.hideTooltip(e);
    if (result === true) {
      this._toastr.success("Course deleted successfully !");
    }
    else {
      this._toastr.error(`Course could not be deleted. Please contact the support team !!`);
    }

  }

  showDialog(e: any): void {
    this.msgModal.show(e);
  }

  hideDialog(e: any): void {
    this.msgModal.hide(e);
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
