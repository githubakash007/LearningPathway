import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CurriculumService } from '../services/curriculum.service';
import { IRole } from '../modal/IRole';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { IOption } from 'ng-select';
import { IFetchCurriculum } from '../services/ICurriculum';
import { EmployeeService } from '../../shared/services/employee.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  roleList: IRole[] = [];
  rolesDropDownOptions: Array<IOption> = [];
  rolesCopyFromDropDownOptions: Array<IOption> = [];
  subscription: Subscription;
  selectedRole: IOption;
  selectedRoleToCopyFrom: IOption;
  isDisabled: boolean = true;
  isCopyFromRole: boolean = false;
  message: string = '';
  infoMessage: string = '';
  @ViewChild('msgModal') modalDialog;
  currentEmployeeName: string = '';


  constructor(private _service: CurriculumService, private _route: Router, private route: ActivatedRoute, private _employeeService: EmployeeService) {

  }

  ngOnInit() {
    this._employeeService.employeeObservable.subscribe(emp => {
      this.currentEmployeeName = emp.EmployeeName;
    }
    );

    this.subscription = this._service.getRoles().subscribe(
      roles => {
        this.roleList = roles;
        this.rolesDropDownOptions = this.mapRolesToDD(this.roleList);

      }

    );

  }

  toggleCopyFromDropDown(e: any): void {
    this.isCopyFromRole = !this.isCopyFromRole;
  }

  onRoleSelect(role: IOption): void {

    this.isDisabled = false;
    this.selectedRole = role;

    if (this.rolesDropDownOptions) {
      this.rolesCopyFromDropDownOptions = this.rolesDropDownOptions.filter(x => x.value != role.value);
    }

    this.resetHistory(role);

  }

  resetHistory(role: IOption): void {

    let roleuid = role.value.split(',')[0];
    let cachedRoleUid = this._service.currentAdminRoleUID;
    if (cachedRoleUid && roleuid !== cachedRoleUid) {
      this._service.setHistoryCourseFromStore([]);
      this._service.setCurrentCourseToStore([]);
    }

  }
  onRoleDeselect(selecteRole: IOption): void {
    this.isDisabled = true;
    this.selectedRole = undefined;

  }

  onCopyFromRoleSelect(role: IOption): void {
    this.selectedRoleToCopyFrom = role;
    this.infoMessage = `The curriculum for ${this.selectedRoleToCopyFrom.label.split(',')[0]} role 
    will be copied to ${this.selectedRole.label.split(',')[0]} role. Click below to proceed.`

  }
  onCopyFromRoleDeselect(selecteRole: IOption): void {
    this.selectedRoleToCopyFrom = undefined;
    this.infoMessage = '';

  }

  showCopyFromDropDown(): boolean {
    let show: boolean = false;
    if (this.isCopyFromRole && this.selectedRole) {
      show = true;
    }
    return show;

  }


  //TODO - optimize it later
  private mapRolesToDD(inputRoles: IRole[]): Array<IOption> {

    let temp = { label: '', value: '' };
    let optionsArray: Array<IOption> = [];

    if (inputRoles) {
      inputRoles.forEach(role => {
        temp.label = role.Role_Name + ',' + role.Role_Id;
        temp.value = role.Role_Uid + ',' + role.Cut_Off_Hours;
        optionsArray.push(Object.assign({}, temp));
      });


    }
    return optionsArray;

  }

  getCurriculumForRole(e: any, roleId: string) {
    e.preventDefault();

  }


  proceed(e: any): void {

    if (this.showCopyFromDropDown() && this.selectedRoleToCopyFrom) {


      this.message = `
      If any courses have been previously selected for the role ${this.selectedRole.label.split(',')[0]}, they will be overwritten
         by the courses selected for ${this.selectedRoleToCopyFrom.label.split(',')[0]} role. Are you sure you want to proceed?`
      this.showDialog(e);
    }
    else {
      this.goToAdminPage(e);
    }
  }

  showDialog(e: any): void {
    this.modalDialog.show(e);
  }

  hideDialog(e: any): void {
    this.modalDialog.hide();
  }

  goToAdminPage(e: any): void {
    e.preventDefault();
    this.removeClass();

    let input: IFetchCurriculum = { "CopyToRoleUID": '', "CopyFromRoleUID": '', "CalenderYear": 2018 };
    if (this.selectedRole) {

      this._service.CurrentAdminRole = this.selectedRole.label.split(',')[0]; //role.Role_Name
      let roleId = this.selectedRole.label.split(',')[1];
      this._service.currentAdminRoleUID = this.selectedRole.value.split(',')[0];  //role.Role_Uid;
      this._service.CurrentAdminRoleCutOffHour = +this.selectedRole.value.split(',')[1];
      input.CopyToRoleUID = this.selectedRole.value.split(',')[0];

      if (this.selectedRoleToCopyFrom) {
        input.CopyFromRoleUID = this.selectedRoleToCopyFrom.value.split(',')[0];
      }

      this._service.historyDataInputObj = input;

      sessionStorage.clear();
      sessionStorage.setItem(input.CopyToRoleUID, this.selectedRole.label.split(',')[0]);
      sessionStorage.setItem(input.CopyToRoleUID + 'cutoff', this.selectedRole.value.split(',')[1]);


      this._route.navigate(['./../roles', input.CopyToRoleUID], { relativeTo: this.route });

    }

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  private removeClass(): void {
    let isClassExist = document.body.classList.contains('modal-open');
    if (isClassExist) {
      document.body.className = document.body.className.replace('modal-open', '');
    }

  }

}
