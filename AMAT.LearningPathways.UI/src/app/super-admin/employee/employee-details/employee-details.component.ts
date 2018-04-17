import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IEmployee } from '../model/IEmployee.modal';
import { SuperAdminService } from '../../services/superAdmin.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  employeeForm: FormGroup;
  constructor(private _toastr: NotificationService, private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public employeeObj: IEmployee
    , private dialogRef: MatDialogRef<EmployeeDetailsComponent>, private _superAdminService: SuperAdminService) {
  }

  ngOnInit() {
    this.employeeForm = this._formBuilder.group({
      EmployeeID: this.employeeObj.EmployeeID,
      EmployeeName: this.employeeObj.EmployeeName,
      WorkEmail: this.employeeObj.WorkEmail,
      IsActive: String(this.employeeObj.IsActive),
      IsPathwayBlocked: String(this.employeeObj.IsPathwayBlocked),
      HasLearnerFrozen: String(this.employeeObj.HasLearnerFrozen),
    });
    this.onChanges();
  }

  onChanges(): void {
    this.employeeForm.valueChanges.subscribe(val => {
    });
  }

  updateEmployee() {

    this._superAdminService.UpdateEmployee(this.employeeForm.value, this.processResult.bind(this));
    this.dialogRef.close(this.employeeForm.value);
  }

  processResult(result: boolean): void {
    if (result === true) {
      this._toastr.success("Updated successfully !");

    }
    else {
      this._toastr.error(`Update failed. Please contact the support team !!`);

    }



  }


}
