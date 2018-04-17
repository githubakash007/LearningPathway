import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { CurriculumService } from './../../admin/services/curriculum.service';
import { ICurriculum, ICourse } from './../../admin/services/ICurriculum';
import { NotificationService } from './../services/notification.service';
import { Observable } from 'rxjs/Observable';
import { ModalDialogService } from '../modules/modal-popup/modal-dialog.service';
import { Skills } from '../enum/skill.enum';
import * as _ from 'lodash';

@Component({
  selector: "mandatory-course",
  templateUrl: './mandatoryCourse.component.html',
  styleUrls: ['./mandatoryCourse.component.css']
})
export class MandatoryCourseComponent implements OnChanges, OnInit {

  @Input() inputMandatoryCurriculumList: ICurriculum[];
  mandatoryCurriculumList: ICurriculum[];
  skillName: string = "";
  totalFoundationalHours: any;
  @Input() skillId;
  currentSelectedAdminRole: string = '';


  constructor(private _toastr: NotificationService, private _service: CurriculumService, private _modalService: ModalDialogService) {
    this.currentSelectedAdminRole = this._service.CurrentAdminRole;
  }

  ngOnChanges(changes: SimpleChanges): void {

    //this.skill = this.inputMandatoryCurriculumList.skillgrp;
    this.skillName = Skills[+(this.skillId - 1)];
    this.mandatoryCurriculumList = _.orderBy(this.inputMandatoryCurriculumList.filter(x => x.IsMandatory === true),"CourseId","asc");

    this.getTotalCourseHours(this.mandatoryCurriculumList)

  }

  getTotalCourseHours(curriculumList: ICurriculum[]): number {
    let total: number = 0;
    if (curriculumList != undefined && curriculumList.length > 0) {
      total = curriculumList.reduce(((sum, val) => sum += val.Duration), 0)
    }
    return total;

  }
  ngOnInit(): void {

  }

  makeCourseElective(e: ICurriculum): void {
    this._service.makeCourseElective(e,this.processResultWithMessage.bind(this));
  }

  deleteCourse(course: ICurriculum): void {
    this._service.deleteCourseFromElective(course, this.processResult.bind(this));
  }

  // ShowCourseDetail(e: any, course: ICurriculum) {
  //   e.preventDefault();
  //   this._modalService.showDialog(course);

  // }

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
