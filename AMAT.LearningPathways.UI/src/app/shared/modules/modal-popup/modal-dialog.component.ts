import { Component, OnInit, OnDestroy, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ModalDialogService } from './modal-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { NotificationService } from '../../services/notification.service';
import { CurriculumService } from '../../../admin/services/curriculum.service';
import { Skills } from '../../enum/skill.enum';
import { ICourseDetail } from './IModalDialog';
import { courseBaseUrlInSABA } from './constants/module.constant';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-modal',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  data: ICourseDetail;
  visible = false;
  visibleAnimate = false;
  isMandatory: boolean;
  showAddToPathBtn: boolean = true;
  callbackFunc: Function = undefined;
  @Input() inputIsMandatory: boolean;
  sabaUrl:string='';

  constructor(private _modalService: ModalDialogService, private _toastr: NotificationService, private _router:Router) {

  }

  ngOnInit() { }


  ngOnDestroy() { }

  public show(e: any, courseId: string, showAddToPathBtn: boolean, callback: Function = undefined, isMandatory: boolean = false): void {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.isMandatory = isMandatory;
    this.showAddToPathBtn = showAddToPathBtn;
    if (this.showAddToPathBtn) {
      this.callbackFunc = callback;
    }

    //refactor
    // this.ismandatory = curriculum.IsMandatory;
    // if(curriculum.Skill){
    //   this.skillName = curriculum.Skill;  
    // }
    // else{
    //   this.skillName = curriculum.SkillUid === "1"?"Foundational":"Functional";
    //    //Skills[+curriculum.SkillUid];
    // }
    // this.skillName = curriculum.Skill;

    this._modalService.getCourseDetail(courseId).subscribe(
      (val) => {
        this.data = val;
        this.sabaUrl = courseBaseUrlInSABA + this.data.CourseInternalId;

      },
      (error) => {
        console.log(error);
        this.processError(error)
      },
      () => {
        this.visible = true;
        let isClassExist = document.body.classList.contains('modal-open');
        if (!isClassExist)
          document.body.className += ' modal-open';
        setTimeout(() => this.visibleAnimate = true, 100);
      }
    );

  }

  public hide(): void {
    this.visibleAnimate = false;
    document.body.className = document.body.className.replace('modal-open', '');
    setTimeout(() => this.visible = false, 300);
  }

  addCourse(course: any) {
    if (this.callbackFunc !== undefined) {
      this.callbackFunc();
    }


  }

  
  private processError(error: Response): void {
    //console.dir(error);

  }

}
