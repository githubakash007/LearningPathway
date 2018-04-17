import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ICurriculum } from '../../../admin/services/ICurriculum';
import { CurriculumService } from '../../../admin/services/curriculum.service';
import { DragulaService, dragula } from 'ng2-dragula';
import * as _ from 'lodash';

@Component({
  selector: 'dnd-course-summary',
  templateUrl: './dnd-course-summary.component.html',
  styleUrls: ['./dnd-course-summary.component.css']
})
export class DndCourseSummaryComponent implements OnInit, OnChanges, OnDestroy {


  @Input() inputRequiredCourseList: ICurriculum[] = [];
  @Input() title: string = '';
  @Input() isRequired: boolean = false;
  @Input() cutOffHour: number = 0;
  message: string = '';
  courseListTitle: string = '';
  bagName: string = '';

  @ViewChild('msgModal') modalDialog;

  requiredDndCourseList: ICurriculum[] = [];
  nextYearCourseList: ICurriculum[] = [];

  constructor(private _service: CurriculumService, private _dservice: DragulaService) {
    var drake = dragula({
      revertOnSpill: true,
      removeOnSpill: false

    });

  }

  canAccept(el, target, source, sibling): boolean {
    let allowit: boolean = true;
    if (source.classList.contains('nextyear-course-container') && target.classList.contains('required-course-container')) {

      let isDragValid = this.isDragValid(el,source);
      if (isDragValid === false) {
        // this._dservice.find('required-courses').drake.cancel(true);
        //alert('invalid drag');
        allowit = false;

      }
      //allowit =  false;
    }

    return allowit;

  }


  ngOnChanges(changes: SimpleChanges) {
    this.setCourseAsPerCutOffHour(this.inputRequiredCourseList);
    this.courseListTitle = this.title;
  }
  ngOnInit() {

    let bag = this._dservice.find('required-courses');
    if (bag != undefined) {
      this.bagName = bag.name;
    }
    else {
      this.bagName = 'required-courses';
    }

    this._dservice.setOptions(this.bagName, {
      accepts: (el: Element, target: Element, source: Element, sibling: Element): boolean => {
        let result: boolean = this.canAccept(el, target, source, sibling);
        if (result === false) {
          this._dservice.find(this.bagName).drake.cancel(true);
          // this.message = `Total hours of required course exceeds your current set limit of <b>${this.cutOffHour} hr</b> per year. 
          //                   <br /> Either increase your cutOff hours per year
          //                     <span class='text-center'>OR</span><br />
          //                     Choose a course of small duration.`


          this.message = `Total hours of required course exceeds your current set limit of ${this.cutOffHour} hr per year. 
                               Either increase your cutOff hours per year
                                OR
                               Choose a course of small duration.`

          setTimeout(function () {
            this.showDialog();
          }.bind(this), 100);

        }
        return result;
      }
    });

    this._dservice
      .drop
      .subscribe(value => {
       
      });

    this._dservice
      .dragend
      .subscribe(value => {
        console.log('drag is end');
       this.requiredDndCourseList = Object.assign([], this.requiredDndCourseList);
        this.nextYearCourseList = Object.assign([], this.nextYearCourseList);

        this._service.setSortedrequiredCourseToStore([...this.requiredDndCourseList,...this.nextYearCourseList]);
       
        
      });

   
  }

  showDialog(): void {
    this.modalDialog.show(undefined);
  }

  hideDialog(e: any): void {
    this.modalDialog.hide(e);
  }
  ngOnDestroy(): void {
    this._dservice.destroy(this.bagName);
  }

  isDragValid(el: HTMLElement,source:HTMLElement): boolean {
    let allowit: boolean = true;
    

    let id = el.dataset.id;
    let courseObj = this.nextYearCourseList.find(x => x.CourseId === id);
     
    let courseId = courseObj.CourseId;
    
    let duration = courseObj.Duration;
    let cutoff = this.cutOffHour;
    let currentRequiredHours = this.getTotalHours(this.requiredDndCourseList);

    let total = (currentRequiredHours + duration);
    total = Math.round(total * 10) / 10;
    if (total > cutoff) {
      allowit = false;
    }

    return allowit;

  }


  setCourseAsPerCutOffHour(inputList: ICurriculum[]): void {
    let requiredCourses: ICurriculum[] = [];
    let nextYearCourses: ICurriculum[] = [];
    let sortedList: ICurriculum[] = [];

    let totalRequiredHours: number = 0;
    //sortedList = _.orderBy<ICurriculum>(inputList, "Duration", "asc");
    sortedList = Object.assign([],inputList);

    while (totalRequiredHours < this.cutOffHour && sortedList.length > 0) {
      let el = sortedList.shift();
      if (el) {
        requiredCourses.push(el);
        totalRequiredHours = this.getTotalHours(requiredCourses);
      }

    }

    if (totalRequiredHours > this.cutOffHour) {
      requiredCourses.pop();
    }

    // get the remaining courses and assign for next year
    nextYearCourses = inputList.filter(x => requiredCourses.indexOf(x) < 0);

    this.requiredDndCourseList =  requiredCourses;
    this.nextYearCourseList = nextYearCourses;

  }

  private getTotalHours(list: ICurriculum[]): number {
    let total = 0;
    if (list) {
      total = list.reduce(((x, y) => x += y.Duration), 0);
      if (total > 0) {
        total = Math.round(total * 10) / 10;
      }
    }
    return total;
  }

}
