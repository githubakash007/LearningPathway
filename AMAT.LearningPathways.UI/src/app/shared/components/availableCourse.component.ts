import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { CurriculumService } from './../../admin/services/curriculum.service';
import { ICurriculum, ICourse, ISearchResult } from './../../admin/services/ICurriculum';
import { NotificationService } from './../services/notification.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/mergeMap";
import { ModalDialogService } from '../modules/modal-popup/modal-dialog.service';
import { ISearchCriteria } from '../../admin/modal/ISearchCriteria';
import { Skills } from '../enum/skill.enum';
import * as _ from 'lodash';
declare let $:any;

@Component({
  selector: "available-course",
  templateUrl: './availableCourse.component.html',
  styleUrls: ['./availableCourse.component.css']
})
export class AvailableCourseComponent implements OnChanges, OnInit {
  //private searchKeyChanged: BehaviorSubject<ISearchCriteria> = new BehaviorSubject<ISearchCriteria>({ "searchBy": '', "searchKey": '', "skillId": '' });
  @Input() curriculumList: ICurriculum[] = [];
  foundationCurriculumList: ICurriculum[]= [];
  isLoading: boolean = false;
  searchString: string;
  searchResult: ISearchResult[] = [];
  showModalDialog: boolean = false;
  @Input() skillId;
  skillName:string='';
  infoTooltip:string =  "Click to mark this course as mandatory";

  constructor(private _toastr: NotificationService, private _service: CurriculumService, private _modalService: ModalDialogService) {
        // this.skillName  = Skills[+this.skillId];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.skillName  = Skills[+(this.skillId -1)];
    this.foundationCurriculumList = _.orderBy(this.curriculumList.filter(x => x.IsMandatory === false),"CourseId","asc");

  }
  ngOnInit(): void {

  }

  MakeCourseMandatory(e:any,course: ICurriculum): void {
    this._service.MakeCourseMandatory(course,this.processResultWithMessage.bind(this));
    this.hideTooltip(e);
    //this._toastr.success("Course added successfully !");
  }
  deleteCourse(course: ICurriculum):void{
     this._service.deleteCourseFromElective(course,this.processResult.bind(this));
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  processResult(result: boolean): void {
    if (result === true) {
      this._toastr.success("Course deleted successfully !");
    }
    else {
      this._toastr.error(`Course could not be deleted. Please contact the support team !!`);
    }

  }

  processResultWithMessage(result: boolean, message: string): void {
           
        if (result === true) {
          this._toastr.success(message);
        }
        else {
         this._toastr.error(message);
         
        }
    
      }

}
