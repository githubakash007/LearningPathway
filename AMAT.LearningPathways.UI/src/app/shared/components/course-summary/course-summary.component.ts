import { Component, OnInit, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ICurriculum } from '../../../admin/services/ICurriculum';
import * as _ from 'lodash';

@Component({
  selector: 'course-summary',
  templateUrl: './course-summary.component.html',
  styleUrls: ['./course-summary.component.css']
})
export class CourseSummaryComponent implements OnInit, OnChanges {

  @Input() inputCourseList: ICurriculum[] = [];
  @Input() title: string = '';
  courseList: ICurriculum[] = [];
  courseListTitle: string = '';
  @Input() isRequired: boolean = false;
  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    this.courseList =  _.orderBy(this.inputCourseList,"CourseId","asc");
    this.courseListTitle = this.title;

  }

  dragStart(e: any): void {
    // console.log(`drag start with data ${e}`);
  }

  dragEnter(e: any): void {

    //document.getElementById(e.target.id).className += 'row-hover';

    if (e.target.id) {
      document.getElementById(e.target.id).className += ' row-hover';
    }


  }

}
