import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICourseCatalog } from '../model/ICourseCatalog.modal';
import { SuperAdminService } from '../../services/superAdmin.service';
import { NotificationService } from '../../../shared/services/notification.service';
@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {
  courseForm: FormGroup;
  skills : string[] = ['Foundational','Functional','Enrichment'];
  constructor(private _toastr: NotificationService,
              private _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) 
              public courseObj: ICourseCatalog,
              private dialogRef: MatDialogRef<CourseEditComponent>,
              private _superAdminService: SuperAdminService) { }

  ngOnInit() {
    this.courseForm = this._formBuilder.group({
      AGU_CODE: this.courseObj.AGU_CODE,
      CourseName : this.courseObj.COURSE_NAME,
      CourseDescription : this.courseObj.COURSE_DESCRIPTION,
      CompetencyName : this.courseObj.COMPETENCY_NAME,
      Environment : this.courseObj.ENVIRONMENT,
      Skill_Name : this.courseObj.SKILL_NAME,
      Duration : this.courseObj.DURATION,
      BasePrice : this.courseObj.BASE_PRICE,
      IS_DEACTIVATED : String(this.courseObj.IS_DEACTIVATED)
    });
  }

  onChanges() : void{
    this.courseForm.valueChanges.subscribe(val => {});
  }

  updateCourse(){
    this._superAdminService.UpdateCourse(this.courseForm.value, this.processResult.bind(this))
    this.dialogRef.close(this.courseForm.value);
  }
  processResult(result: boolean): void {
    if (result === true) {
      this._toastr.success("Updated successfully");
    }
    else {
      this._toastr.error("Update failed. Please contact the support team");
    }
  }

}
