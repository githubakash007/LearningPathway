import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
import { NotificationService } from '../../../shared/services/notification.service';
import { LearnerCurriculumService } from '../../services/learner.service';
import { ModalDialogService } from '../../../shared/modules/modal-popup/modal-dialog.service';
import * as _ from 'lodash';
declare let $: any;

@Component({
  selector: 'learner-mandatory-course',
  templateUrl: './mandatory-course.component.html',
  styleUrls: ['./mandatory-course.component.css']
})
export class LearnerMandatoryCourseComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() inputMandatoryCourseList: ILearnerCurriculum[] = [];
  mandatoryCourseList: ILearnerCurriculum[];
  mandatoryCourseListForSummation: ILearnerCurriculum[];
  @Input() inputSkillName: string = "";
  skillName: string = "";
  constructor(private _toastr: NotificationService, private _service: LearnerCurriculumService, private _modalService: ModalDialogService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.skillName = this.inputSkillName;
    this.mandatoryCourseList = _.orderBy(this.inputMandatoryCourseList.filter(x => x.IsMandatory === true),"CourseId","asc");
    this.mandatoryCourseListForSummation = this.inputMandatoryCourseList.filter(x => x.IsMandatory === true && x.IsCourseCompleted === false);
  }

  showCourseDetail(e: any, course: ILearnerCurriculum) {
    e.preventDefault();
    // this._modalService.showDialog(course);

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
      else if(c.IsCourseCompleted === true && c.IsCourseDeactivated === true) {
        title = `You have already completed this course. Although this course has been removed from AGU now but you will get the credit for this course.`;
      }
     
      return title;
    })(course)
    $(e.srcElement).tooltip('show');
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  expand(ee:any,context:any,e:any):void{
           ee.preventDefault();

           if(document.getElementById(context).getAttribute('data-show-expand') === 'false'){

            setTimeout(function() {
              document.getElementById(context).innerHTML = e.join();         
              document.getElementById(context).setAttribute('data-show-expand','true');
              ee.srcElement.innerText = '...'; 
            }, 100);
             
           }
           else{
             setTimeout(function() {
              document.getElementById(context).innerHTML = e.slice(0,2).join();  
              document.getElementById(context).setAttribute('data-show-expand','false');
              ee.srcElement.innerText = '...';   
             }, 100);
            
           }
    
  }

}
