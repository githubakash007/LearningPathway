import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { CurriculumService } from './../../admin/services/curriculum.service';
import { ICurriculum, ICourse } from './../../admin/services/ICurriculum';
import { ISkillHours } from '../model/skillhour.interface';
import { Skills } from './../enum/skill.enum';

@Component({
  selector: "breadcrumb-skill",
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  skillHourList: ISkillHours[] = [];

  constructor(private _service: CurriculumService) { }


  ngOnInit(): void {
    this._service.curriculumListObservable.subscribe(curriculumList => {
      if (curriculumList != undefined)
        this.skillHourList = this.getSkillAndHours(curriculumList)
    }
    );
  }

  private getSkillAndHours(curriculumList: ICurriculum[]): ISkillHours[] {

    let result: ISkillHours[] = [];
    let item: ISkillHours = { skill: "", hours: 0 };
    
    let len:number =  Object.keys(Skills).length/2;
       
         
    let skillName:string;
     result.length = 0;
    for(let i=0; i < len;i++){
      skillName = Skills[i];
      item = {
        skill: skillName,
        hours: this.getTotalCourseHours(skillName,curriculumList)
      }
      result.push(<ISkillHours>item);
    }
   
    return result;

  }

  getTotalCourseHours(skillName:string,curriculumList: ICurriculum[]): number {
    let total: number = 0;
    let filteredList = curriculumList.filter(x => x.Skill === skillName);
    let selectedCourseList = filteredList.filter(course => course.IsMandatory === true);
    total = selectedCourseList.reduce(((sum, val) => sum += val.Duration), 0);
      if(total > 0){
        total = Math.round(total * 10)/10;
      }
    return total;
  }


}
