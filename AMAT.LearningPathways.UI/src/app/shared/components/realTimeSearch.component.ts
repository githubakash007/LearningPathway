import { Component, OnChanges, OnInit, Input, Output, SimpleChanges, EventEmitter, ViewChild } from '@angular/core';
import { CurriculumService } from './../../admin/services/curriculum.service';
import { ICurriculum, ICourse, ISearchResult } from './../../admin/services/ICurriculum';
import { NotificationService } from './../services/notification.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/finally';
import { ISearchCriteria } from '../../admin/modal/ISearchCriteria';

@Component({
  selector: "realTimeSearch-courses",
  templateUrl: './realTimeSearch.component.html',
  styleUrls: ['./realTimeSearch.component.css']
})
export class RealTimeSearchComponent implements OnChanges {

  @Output() searchKey: EventEmitter<ISearchCriteria> = new EventEmitter<ISearchCriteria>();
  isError: boolean;
  showResultBox: boolean = false;
  removeResultBox: boolean = false;
  @Input() isBusy = false;
  @Input() searchResult: ISearchResult[] = [];
  selectedSearchKey: string = "courseId";
  @ViewChild('modal') modalDialog;
  //@Input() isCourseAdded:boolean = false;
  //@Input() searchCourseAdded:boolean = false;

  @Input() skillId: string;
  searchCriteria: ISearchCriteria = { "searchBy": this.selectedSearchKey, "searchKey": '', "skillId": this.skillId };
  errorMessage: string;

  @Output() onShowSearchedCourseDetail: EventEmitter<ISearchResult> = new EventEmitter<ISearchResult>();
  @Output() onAddSearchedCourse: EventEmitter<ISearchResult> = new EventEmitter<ISearchResult>();
  constructor(private _toastr: NotificationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.searchCourseAdded = this.isCourseAdded;
  }

  onSearchInputChange(searchInput: string): void {

    if (searchInput != undefined && searchInput.trim().length === 0) {
      this.showResultBox = false;
      this.removeResultBox = false;
      // this.searchCriteria = {"searchBy":'',"searchKey":'',"skillId":''};
    }
    else {
      this.removeResultBox =true;
      this.showResultBox = true;
      this.searchCriteria = Object.assign({}, { "searchBy": this.selectedSearchKey, "searchKey": searchInput, "skillId": this.skillId })
      this.searchKey.emit(this.searchCriteria);

    }


  }

  addCourseFromSearch(course: ISearchResult): void {
    this.onAddSearchedCourse.emit(course);

  }


  showCourseDetailPopUp(course: ISearchResult): void {
    this.onShowSearchedCourseDetail.emit(course);
  }

  processResult(result: boolean, isCourseExist: boolean): void {

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
