import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { LearnerCurriculumService } from '../../services/learner.service';
import { LearnerSkills } from '../../enum/learnerSkills.enum';
import { ISkillHours } from '../../../shared/model/skillhour.interface';
import { ILearnerCurriculum } from '../../modal/ILearnerCurriculum';

@Component({
  selector: "learner-breadcrumb-skill",
  templateUrl: './learnerBreadcrumb.component.html',
  styleUrls: ['./learnerBreadcrumb.component.css']
})
export class LearnerBreadcrumbComponent implements OnInit {

  skillHourList: ISkillHours[] = [];

  constructor(private _service: LearnerCurriculumService) { }


  ngOnInit(): void {
    this._service.learnerCurriculumListObservable.subscribe(curriculumList => {
      if (curriculumList != undefined)
        this.skillHourList = this.getSkillAndHours(curriculumList)
    }
    );
  }

  private getSkillAndHours(curriculumList: ILearnerCurriculum[]): ISkillHours[] {

    let result: ISkillHours[] = [];
    let item: ISkillHours = { skill: "", hours: 0 };
    
    let len:number =  Object.keys(LearnerSkills).length/2;
       
         
    let skillName:string;
     result.length = 0;
    for(let i=0; i < len;i++){
      skillName = LearnerSkills[i];
      item = {
        skill: skillName,
        hours: this.getTotalCourseHours(skillName,curriculumList)
      }
      result.push(<ISkillHours>item);
    }
   
    return result;

  }

  getTotalCourseHours(skillName:string,curriculumList: ILearnerCurriculum[]): number {
    let total: number = 0;
    let filteredList = curriculumList.filter(x => x.Skill === skillName);
    let selectedCourseList = filteredList.filter(course => course.IsCourseCompleted === false && (course.IsMandatory === true || course.IsSelected === true));
    total = selectedCourseList.reduce(((sum, val) => sum += val.Duration), 0);
      if(total > 0){
        total = Math.round(total * 10)/10;
      }
    return total;
  }


}
