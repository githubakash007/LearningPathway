import { Component, OnChanges, OnInit, Input, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ISearchResult } from './../../admin/services/ICurriculum';
import { NotificationService } from './../services/notification.service';
import {CurrencyPipe} from '@angular/common';
declare let $: any;

@Component({
  selector: "course-list",
  animations: [
    trigger('isVisibleChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnChanges, OnInit {

  @Input() inputCourseList: ISearchResult[];
  @Input() isVisible: boolean;
  courseList: ISearchResult[];
  //@Input() isCourseAdded: boolean = false;
  //courseAdded: boolean = false;
  @Output() onCourseDetail: EventEmitter<ISearchResult> = new EventEmitter<ISearchResult>();
  @Output() onAddCourse: EventEmitter<ISearchResult> = new EventEmitter<ISearchResult>();

  constructor(private _toastr: NotificationService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.courseList = this.inputCourseList;
    // this.courseAdded = this.isCourseAdded;

  }

  ngOnInit(): void {
    // this.foundationCurriculumList = this.curriculumList.courses.filter(x => x.isselected === 0);

  }

  showCourseDetails(e: any, input: ISearchResult): void {
    e.preventDefault();
    e.stopPropagation();
    this.onCourseDetail.emit(input);
  }

  addCourse(e: any, course: ISearchResult): void {
    e.preventDefault();
    e.stopPropagation();
    this.onAddCourse.emit(course);
    this.hideTooltip(e);
  }

  hideTooltip(e: any): void {
    $(e.srcElement).tooltip('hide');
  }

  showTooltip(e: any, course: ISearchResult): void {
    $(e.srcElement).data('bs.tooltip').options.title = ((c: ISearchResult): string => {
      let title = '';
      if (c.IsCourseCompleted === true) {
        title = `You have already completed this course.`
      }
      return title;
    })(course)

    $(e.srcElement).tooltip('show');
  }

  // hideTooltip(e: any): void {
  //   $(e.srcElement).tooltip('hide');
  // }

}
