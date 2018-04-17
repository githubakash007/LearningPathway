import { Component, OnInit } from '@angular/core';
import { CurriculumService } from './../../admin/services/curriculum.service';
import { ICurriculum, ICourse } from './../../admin/services/ICurriculum';

@Component({
  selector: "total-hours",
  templateUrl: './totalhours.component.html',
  styleUrls: ['./totalhours.component.css']
})
export class TotalHoursComponent implements OnInit {

  totalHours: number = 0;

  constructor(private _service: CurriculumService) { }


  ngOnInit(): void {
    this._service.curriculumListObservable.subscribe(curriculumList => {
      if (curriculumList != undefined)
        //this.totalHours = this.getTotalCourseHours(curriculumList)
        this.totalHours = this.getSum(curriculumList);
    }

    );
  }


  getSum(courselist: ICurriculum[]): number {
    let total: number = 0;
    if (courselist != undefined && courselist.length > 0) {
      let selectedCourse = courselist.filter(x => (x.IsMandatory === true));
      total = selectedCourse.reduce(((sum, val) => sum += val.Duration), 0)
    }

    if (total > 0) {
      total = Math.round(total * 10) / 10;
    }
    return total;
  }

}
