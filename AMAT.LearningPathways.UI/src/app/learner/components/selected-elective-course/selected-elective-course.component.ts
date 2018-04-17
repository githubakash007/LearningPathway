import { Component, OnInit, Input, SimpleChanges,AfterViewInit } from '@angular/core';
import { LearnerCurriculumService } from '../../services/learner.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ModalDialogService } from '../../../shared/modules/modal-popup/modal-dialog.service';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
import {maxFoundationalElectiveCourseCount} from './../../constants/learner.constant';
import * as _ from 'lodash';
declare let $: any;

@Component({
  selector: 'selected-elective-course',
  templateUrl: './selected-elective-course.component.html',
  styleUrls: ['./selected-elective-course.component.css']
})
export class SelectedElectiveCourseComponent implements OnInit,AfterViewInit {

  @Input() inputselectedElectiveCourseList: ILearnerCurriculum[] = [];
  @Input() inputCourseCount: number = 0;
  @Input() inputSkillName: string = '';
  courseCount: number = 0;
  skillName: string = '';
  requiredElectiveCourse: number = 0;
  selectedElectiveCourseList: ILearnerCurriculum[] = [];
  selectedElectiveCourseListForSummation: ILearnerCurriculum[] = [];
  
  constructor(private _toastr: NotificationService, private _lernerService: LearnerCurriculumService, private _modalService: ModalDialogService) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

    let change = changes['inputselectedElectiveCourseList'];
    if (change.isFirstChange()) {
      this.courseCount = this.inputCourseCount;
      this.skillName = this.inputSkillName;
      this.requiredElectiveCourse = this._lernerService.getFiftyPercentageOfElectiveCourses(this.courseCount);
    }
    this.selectedElectiveCourseList =  _.orderBy(Object.assign(this.inputselectedElectiveCourseList.filter(x => x.IsMandatory === false && x.IsSelected === true)),"CourseId","asc");
    this.selectedElectiveCourseListForSummation = Object.assign(this.inputselectedElectiveCourseList.filter(x => x.IsMandatory === false && x.IsSelected === true && x.IsCourseCompleted === false));


  }

  ngAfterViewInit(): void {
    // (<any>$('[data-toggle="tooltip"]')).tooltip();
  }

  showTooltip(e: any, course: ILearnerCurriculum): void {
    $(e.srcElement).data('bs.tooltip').options.title = ((c: ILearnerCurriculum): string => {
      let title = '';
      if (c.IsCourseCompleted === true && c.IsCourseDeactivated === false) {
        title = `You have already completed this course.`
      }
      else if (c.IsCourseCompleted === true && c.IsCourseDeactivated === true) {
        title = `You have already completed this course. Although this course has been removed from AGU now but you will get the credit for this course.`;
      }
      // else {
      //   title = `<p>Learning environment: ${c.LearningEnv}</p>`
      // }
      return title;
    })(course)

    $(e.srcElement).tooltip('show');
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  getCount(): any {

    let num = this._lernerService.getFiftyPercentageOfElectiveCourses(this.courseCount);  //this.getFiftyPercentageOfElectiveCourses();
    let count = num - this.selectedElectiveCourseList.length;
    let arr = [];

    for (let i = 0; i < count; i++) {
      arr.push(i);
    }
    return arr;
  }

  deleteCourse(e:any,course: ILearnerCurriculum): void {
    this._lernerService.deleteElectiveCourse(course,e, this.processResult.bind(this));
    this.hideTooltip(e);
  }

  processResult(result: boolean,e:any): void {
    this.hideTooltip(e);
    if (result === true) {
      this._toastr.success("Course deleted successfully !");
     
    }
    else {
      this._toastr.error(`Course could not be deleted. Please contact the support team !!`);
      this.hideTooltip(e);
    }

  }

  // getFiftyPercentageOfElectiveCourses(): number {
  //   let result = 0;
  //   //let len =  this._lernerService.electiveCourseCount + this.selectedElectiveCourseList.length;
  //   let len = this.courseCount;
  //   result = Math.floor((len) / 2);
  //   return result;
  // }

  // getElectiveChecks(): IElectiveCheck[] {
  //   let result: IElectiveCheck[] = [];
  //   let obj = { "id": -1, "checkMark": false };
  //   let num = this.getFiftyPercentageOfElectiveCourses();
  //   for (let i = 0; i < num; i++) {
  //     obj = { "id": i, "checkMark": false };
  //     result.push(obj);
  //   }
  //   return result;
  // }

}
