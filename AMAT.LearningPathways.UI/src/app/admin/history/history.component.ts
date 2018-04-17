import { Component, OnChanges, OnInit, Input, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CurriculumService } from '../services/curriculum.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ModalDialogService } from '../../shared/modules/modal-popup/modal-dialog.service';
import { IHistoryCurriculum, ISearchResult } from '../services/ICurriculum';
import { ISearchCriteria } from '../modal/ISearchCriteria';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import * as _ from 'lodash';
declare let $: any;

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'lastyear-courses',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, AfterViewInit {

  private searchKeyChanged: BehaviorSubject<ISearchCriteria> = new BehaviorSubject<ISearchCriteria>({ "searchBy": '', "searchKey": '', "skillId": '' });
  @Input() historyCurriculumList: IHistoryCurriculum[] = [];
  historyList: IHistoryCurriculum[];
  @Input() skillId;
  isLoading: boolean = false;
  searchString: string;
  searchResult: ISearchResult[] = [];
  showModalDialog: boolean = false;
  currentSelectedAdminRole: string;
  employeeName: string;
  @ViewChild('modal') courseDetailModalDialog;


  constructor(private _toastr: NotificationService, private _service: CurriculumService, private _modalService: ModalDialogService) {

    this._service.employeeObservable.subscribe(
      (emp) => {
        if (emp) {
          this.employeeName = emp.EmployeeName;
        }
      }
    );

    this.currentSelectedAdminRole = this._service.CurrentAdminRole;
    this.searchKeyChanged
      .debounceTime(1000)
      .filter(searchCriteria => searchCriteria !== undefined && searchCriteria !== null || searchCriteria.searchKey !== '')
      .distinctUntilChanged((x, y) => { this.isLoading = x === y ? false : this.isLoading; return x === y })
      .switchMap(searchCriteria => searchCriteria !== undefined && searchCriteria !== null && searchCriteria.searchKey ?
        this._service.getSearchResult(searchCriteria) :
        Observable.of(null)
      )
      .subscribe(items => {
        this.searchResult = items || [];

        this.isLoading = false;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.historyList = this.historyCurriculumList;

  }
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //(<any>$('[data-toggle="tooltip"]')).tooltip();

  }

  searchCourses(searchCriteria: ISearchCriteria): void {
    if (searchCriteria && searchCriteria.searchKey
      && !(_.isEqual(this.searchKeyChanged.getValue(), searchCriteria))) {
      this.searchString = searchCriteria.searchKey;
      this.isLoading = true;
      this.searchKeyChanged.next(searchCriteria);
    }

  }

  AddCourseToCurrentYear(e: any, course: IHistoryCurriculum): void {
    this._service.addNewCourseFromLastYear(course, this.processResult.bind(this));
    this.hideTooltip(e);

  }

  addCourseFromSearch(course: ISearchResult): void {
    this._service.addNewCourseFromSearchResult(course, this.processResult.bind(this));
  }

  hideTooltip(e: any): void {
    //if (e && e.srcElement) {
      $(e.srcElement).tooltip('hide');
   // }
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



}
