import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CurriculumService } from './../services/curriculum.service';
import { ICurriculum, ICourse, IHistoryCurriculum } from './../services/ICurriculum';
import { Skills } from './../../shared/enum/skill.enum';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDialogService } from '../../shared/modules/modal-popup/modal-dialog.service';
declare let $: any;
import { EmployeeService } from '../../shared/services/employee.service';

@Component({
  selector: 'admin-curriculum',
  templateUrl: './adminCurriculum.component.html',
  styleUrls: ['./adminCurriculum.component.css']
})
export class AdminCurriculumComponent implements OnInit, OnDestroy {

  title = 'Admin';
  @ViewChild('modal') modal;
  isDataLoaded: boolean = false;
  foundationCurriculumList: ICurriculum[] = [];
  list: ICurriculum[];
  funcCurriculumList: ICurriculum[] = [];
  skillList: string[];
  roleId: string;
  historyCurriculumList: IHistoryCurriculum[] = [];
  functionalHistoryCurriculumList: IHistoryCurriculum[] = [];
  foundationalHistoryCurriculumList: IHistoryCurriculum[] = [];

  currentSelectedAdminRole: string;
  employeeName: string;

  constructor(private route: ActivatedRoute,  private _modalService: ModalDialogService, private _employeeService: EmployeeService, private _service: CurriculumService) { // 2
   
    this._employeeService.employeeObservable.subscribe(
      (emp) => {
        if (emp) {
          this.employeeName = emp.EmployeeName;
          //this.currentSelectedAdminRole = emp.Role_Name;
        }
      }
    );

    this.currentSelectedAdminRole =  this._service.currentAdminRole;

    //this.currentSelectedAdminRole = this._service.CurrentAdminRole;
    //console.log("constructor on admin called");
    // let currentCoursesFromHistory:IHistoryCurriculum[] = this._service.getHistoryCourseFromStore().filter(x => x.IsActive === true);

    this.list = this._service.getCurrentCourseFromStore();

    this.historyCurriculumList = this._service.getHistoryCourseFromStore();

    this.functionalHistoryCurriculumList = this.historyCurriculumList.filter(x => x.Skill === Skills[(Skills.Functional)] && x.IsActive === false && x.visible === true);
    this.foundationalHistoryCurriculumList = this.historyCurriculumList.filter(x => x.Skill === Skills[(Skills.Foundational)] && x.IsActive === false && x.visible === true);
    this._service.setInitialValue(this.list);

  }

  // private ConvertHistoryToCurrent(currentCourses: IHistoryCurriculum[]): ICurriculum[] {

  //      const curriculumList: ICurriculum[] =  currentCourses;

  //     return curriculumList;
  // }



  ngOnInit(): void {

   

    this._service.curriculumListObservable.subscribe(curriculumList => {

      //if (curriculumList != undefined && curriculumList.length > 0) {
      if (curriculumList) {

        this.funcCurriculumList = Object.assign([], curriculumList.filter(x => x.Skill === Skills[(Skills.Functional)]));

        this.foundationCurriculumList = Object.assign([], curriculumList.filter(x => x.Skill == Skills[(Skills.Foundational)]));
        this.historyCurriculumList = this._service.getHistoryCourseFromStore();
        this.functionalHistoryCurriculumList = this.historyCurriculumList.filter(x => x.SkillUid === "2" && x.IsActive === false && x.visible === true);
        this.foundationalHistoryCurriculumList = this.historyCurriculumList.filter(x => x.SkillUid === "1" && x.IsActive === false && x.visible === true);
      }
    });



  }
  showpop(): void {
    this.modal.show();
  }

  openModal(id: string): void {

  }
  closeModal(id: string) {

  }

  //Will optimize the below two function later.
  navigateTab(e: any): void {

    e.preventDefault();
    $('#pathwayTab li#lifoundational').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
    $('#pathwayTab li#lifunctional').addClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "true");
    $('#pathwayTabContent div#foundational').removeClass('active');
    $('#pathwayTabContent div#functional').addClass('active');
    window.scrollTo(0, 0);

  }

  navigateBack(e: any): void {

    // e.preventDefault();
    // $('#pathwayTab li.active').prev().find('a[data-toggle="tab"]').click();
    e.preventDefault();
    $('#pathwayTab li#lifoundational').addClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "true");
    $('#pathwayTab li#lifunctional').removeClass('active').find('a[data-toggle="tab"]').attr("aria-expanded", "false");
    $('#pathwayTabContent div#foundational').addClass('active');
    $('#pathwayTabContent div#functional').removeClass('active');
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {

  }

}
