import { Component, ViewChild } from '@angular/core';
import { CurriculumService } from './admin/services/curriculum.service';
import { LearnerCurriculumService } from './learner/services/learner.service';
import { EmployeeService } from './shared/services/employee.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppStateService } from './shared/services/appstate.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  employeeName: string;
  videoName: string = '';
  @ViewChild('msgModal') modalDialog;

  showMyApprovalLink: boolean = false;;
  pendingApprovalCount: number = 0;


  constructor(private _router: Router, private route: ActivatedRoute, private _appState: AppStateService, private _learnerService: LearnerCurriculumService, private _employeeService: EmployeeService) {

    this._appState.videoObservable.subscribe((videoname) => this.videoName = videoname);

    this._employeeService.employeeObservable.subscribe(
      (emp) => {
        if (emp) {
          this.employeeName = emp.EmployeeName,
            this.showMyApprovalLink = emp.SHOW_MY_APPROVAL_FLAG,
            this.pendingApprovalCount = emp.PENDING_APPROVAL_COUNT;

        }
      }
    );

  }


  private getEmployeeName() {

  }

  doNothing(e: any) {
    e.preventDefault();
  }

  showVideo(e: any): void {

  }

  hideDialog(e: any): void {
    let VideoEle: HTMLVideoElement = <HTMLVideoElement>document.getElementById("LPVideo");
    VideoEle.pause();
    this.modalDialog.hide();
  }

  redirectToManager(e: any): void {
    e.preventDefault();
    this._router.navigate(['../manager'], { relativeTo: this.route })
    //this._router.navigate(['/manager']);
  }
}
