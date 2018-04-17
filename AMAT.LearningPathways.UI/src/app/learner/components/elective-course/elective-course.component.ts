import { Component, OnInit, SimpleChanges, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { LearnerCurriculumService } from '../../services/learner.service';
import { ModalDialogService } from '../../../shared/modules/modal-popup/modal-dialog.service';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
import * as _ from 'lodash';
import { LearnerSkills } from '../../enum/learnerSkills.enum';
declare let $: any;

@Component({
  selector: 'learner-elective-course',
  templateUrl: './elective-course.component.html',
  styleUrls: ['./elective-course.component.css']
})
export class ElectiveCourseComponent implements OnInit, AfterViewInit {
  @Input() inputAssignedElectiveCourseList: ILearnerCurriculum[] = [];
  @Input() inputCourseType: string = '';
  courseType: string = '';
  assignedElectiveCourseList: ILearnerCurriculum[] = [];
  @ViewChild('msgModal') modalDialog;
  @ViewChild('modal') courseDetailModalDialog;
  validationMessage: string = '';
  constructor(private _toastr: NotificationService, private _learnerService: LearnerCurriculumService, private _modalService: ModalDialogService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //(<any>$('[data-toggle="tooltip"]')).tooltip();
   
    this.courseType = this.inputCourseType;
    this.assignedElectiveCourseList = _.orderBy(Object.assign(this.inputAssignedElectiveCourseList.filter(x => x.IsMandatory === false && x.IsSelected === false)), "CourseId", "asc");


  }

  ngAfterViewInit(): void {
  }

  showTooltip(e: any, course: ILearnerCurriculum): void {
    $(e.srcElement).data('bs.tooltip').options.title = ((c: ILearnerCurriculum): string => {
      let title = '';
      if (c.IsCourseCompleted === true) {
        title = `You have already completed this course.`
      }
      return title;
    })(course)

    $(e.srcElement).tooltip('show');
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  addCourse(e:any,course: ILearnerCurriculum): void {
    if (this._learnerService.isCourseAdditionValid(this.courseType)) {
      this._learnerService.addElectiveCourse(course, this.processResultWithMessage.bind(this));
      
    }
    else {
        if (this.courseType === LearnerSkills[LearnerSkills.Functional]) {
            this.validationMessage = `You cannot add functional courses before adding required number of foundational electives for your pathway`;
        }
        else if (this.courseType === LearnerSkills[LearnerSkills.Foundational]) {
            this.validationMessage = `You have already selected the required number of ${this.courseType} elective courses.`;
        }
      this.showDialog(undefined);
    }
    $(e.srcElement).tooltip('hide');
  }



  processResultWithMessage(result: boolean, message: string): void {

    this.courseDetailModalDialog.hide();
    if (result === true) {
      this._toastr.success("Course added successfully !");
    }
    else {
      //this._toastr.error(`Adding new course has failed. please contact the support team !!`);
      this._toastr.error(message);
    }

  }

  processResult(result: boolean, isCourseExist: boolean): void {
    if (result === true) {
      this._toastr.success("Course added successfully !");
    }
    else {
      this._toastr.error(`Adding new course has failed. please contact the support team !!`);
    }

  }

  showDialog(e: any): void {
    this.modalDialog.show(e);
  }

  hideDialog(e: any): void {
    this.modalDialog.hide(e);
  }

}
