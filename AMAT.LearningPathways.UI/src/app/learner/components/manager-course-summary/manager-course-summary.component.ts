import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';
declare let $: any;

@Component({
  selector: 'manager-course-summary',
  templateUrl: './manager-course-summary.component.html',
  styleUrls: ['./manager-course-summary.component.css']
})
export class ManagerCourseSummaryComponent implements OnInit {

  @Input() inputLearnerCourseList: ILearnerCurriculum[] = [];
  @Input() title: string = '';
  courseList: ILearnerCurriculum[] = [];
  notCompletedCourseList: ILearnerCurriculum[] = [];
  courseListTitle: string = '';
  totalCost: number = 0;
  constructor() { }


  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    this.courseList = this.inputLearnerCourseList;
    this.notCompletedCourseList = Object.assign([], this.inputLearnerCourseList.filter(x => x.IsCourseCompleted === false));
    this.courseListTitle = this.title;
    this.totalCost = this.calculateTotalCost(this.notCompletedCourseList);
  }
  showTooltip(e: any, course: ILearnerCurriculum): void {
    $(e.srcElement).data('bs.tooltip').options.title = ((c: ILearnerCurriculum): string => {
      let title = '';
      if (c.IsCourseCompleted === true) {
        title = `Employee has already completed this course.`

      }
      return title;
    })(course)
    $(e.srcElement).tooltip('show');
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  calculateTotalCost(array: ILearnerCurriculum[]): number {

    let totalHours: number = 0;
    if (array && array.length > 0) {
      totalHours = array.reduce(((summation, currentItem) => summation += currentItem.BasePrice), 0);
    }

    if (totalHours > 0) {
      totalHours = Math.round(totalHours * 10) / 10;
    }
    return totalHours;
  }

}
