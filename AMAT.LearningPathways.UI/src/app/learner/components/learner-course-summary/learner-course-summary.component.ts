import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';

@Component({
  selector: 'learner-course-summary',
  templateUrl: './learner-course-summary.component.html',
  styleUrls: ['./learner-course-summary.component.css']
})
export class LearnerCourseSummaryComponent implements OnInit {

  @Input() inputLearnerCourseList: ILearnerCurriculum[] = [];
  @Input() title: string = '';
  courseList: ILearnerCurriculum[] = [];
  courseListTitle: string = '';
  //@Input() isRequired: boolean = false;
  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    this.courseList = this.inputLearnerCourseList;
    this.courseListTitle = this.title;

  }

}
