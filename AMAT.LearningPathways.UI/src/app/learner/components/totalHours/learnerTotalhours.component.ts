import { Component, OnInit } from '@angular/core';
import { LearnerCurriculumService } from '../../services/learner.service';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';

@Component({
  selector: "learner-total-hours",
  templateUrl: './learnerTotalhours.component.html',
  styleUrls: ['./learnerTotalhours.component.css']
})
export class LearnerTotalHoursComponent implements OnInit {

  totalHours: number = 0;
  maxAllowedHours:number =0;

  constructor(private _learnerService: LearnerCurriculumService) {
    this.maxAllowedHours = this._learnerService.maxAllowedHours;
   }


  ngOnInit(): void {
    this._learnerService.learnerCurriculumListObservable.subscribe(curriculumList => {
     
      if (curriculumList != undefined)
        this.totalHours = this.getSum(curriculumList);
    }

    );
  }


  getSum(courselist: ILearnerCurriculum[]): number {
    let total: number = 0;
    if (courselist != undefined && courselist.length > 0) {
      let selectedCourse = courselist.filter(x => x.IsCourseCompleted === false && (x.IsMandatory === true || x.IsSelected === true));
      total = selectedCourse.reduce(((sum, val) => sum += val.Duration), 0)
    }

    if (total > 0) {
      total = Math.round(total * 10) / 10;
    }
    return total;
  }

}
