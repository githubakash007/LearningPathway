import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ICourseCatalog } from '../model/ICourseCatalog.modal';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SuperAdminService } from '../../services/superAdmin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { SuperAdminConst } from '../../enum/superAdminConst.enum';
@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.css']
})
export class CourseAddComponent implements OnInit {

  courseAddForm : FormGroup;
  skills = [
     {key : 1, value : 'Foundational'}
    ,{key : 2, value : 'Functional'}
    ,{key : 3, value : 'Enrichment'}];  
  learningEnvironments = [
     {key : 1, value : 'appliedx'}
    ,{key : 2, value : 'Classroom'}
    ,{key : 3, value : 'WBT'}];
  constructor(private _formBuilder: FormBuilder,
    private _toastr: NotificationService,
    @Inject(MAT_DIALOG_DATA) public courseObj : ICourseCatalog,
    private dialogRef: MatDialogRef<CourseAddComponent>,
    private _superAdminService: SuperAdminService) { }

    
  ngOnInit() {
    this.courseAddForm = this._formBuilder.group({
      AGU_CODE: new FormControl('',Validators.required),
      Course_Name : new FormControl('',Validators.required),
      Skill_Name : new FormControl(this.skills[0].key,Validators.required),
      ENVIRONMENT : new FormControl(this.learningEnvironments[0].key, Validators.required),
      DURATION : new FormControl('', Validators.required),
      BASE_PRICE : new FormControl('', Validators.required),
      IS_DEACTIVATED : new FormControl('0',Validators.required)
    });
  }

  AddCourse(){
    if(this.courseAddForm.valid){
      console.log(this.courseAddForm.value);
      
      this._superAdminService.AddCourse(this.courseAddForm.value,this.processResult.bind(this))
    }
  }

  processResult(result: SuperAdminConst): void {
    if (result === SuperAdminConst.courseAdded) {
      this._toastr.success("Course Added successfully");
      this.dialogRef.close(this.courseAddForm.value);
    }
    else if(result === SuperAdminConst.duplicateCourse){
      this._toastr.warning("Course already exists");
    }
    else{
      this._toastr.error("Course addition failed. Please contact administrator");
    }
  }

}
