import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { AuthService } from '../services/auth.service';
//import { CurriculumService } from '../../admin/services/curriculum.service';
import { LearnerCurriculumService } from '../../learner/services/learner.service';
import { EmployeeService } from '../services/employee.service';
import { AppStateService } from '../services/appstate.service';
import { learnerDemoVideo } from './../constants/app.constant';

@Injectable()
export class CanActivateLearner implements CanActivate {

    constructor(private _authService: AuthService, private _employeeService: EmployeeService, private _router: Router, private _appState: AppStateService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {

        //window.location.href = "https://spprdappweb.amat.com/LearningPathways/learner/";
        this._appState.videoSource.next(learnerDemoVideo);

        return this._authService.IsUserLearner().map(e => {

            if (e && e.IS_LEARNER && e.HAS_LEARNER_FROZEN) {
                this._router.navigate(["/learner-access-frozen"]);
                return false;
            }
            else if (e && e.IS_LEARNER) {
                if (e.IS_ROLE_SUBMITTED && e.IS_PATHWAY_SUBMITTED === false) {
                    this._appState.IsPathwaySubmitted(false);
                    this._employeeService.employeeSource.next(e);
                    return true;
                }
                else if (e.IS_ROLE_SUBMITTED && e.IS_PATHWAY_SUBMITTED) {
                    this._appState.IsPathwaySubmitted(true);
                    this._employeeService.employeeSource.next(e);
                    return true;
                }
                else {
                    this._router.navigate(["/rst-pending"]);
                    return false;
                }
            }
            else {
                this.setExclusionListUrl(e.ExclusionListUrl);
                this._router.navigate(["/access-denied"]);
                return false;
            }
        }).catch((error) => {
            // this._router.navigate(["custom-error-page"]);
            return Observable.of(false);
        });
    }

    private setExclusionListUrl(url: string): void {
        sessionStorage.setItem("exclusionlist", url);
    }
}