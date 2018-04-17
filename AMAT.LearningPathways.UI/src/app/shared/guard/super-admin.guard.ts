import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { AuthService } from '../services/auth.service';
import { CurriculumService } from '../../admin/services/curriculum.service';
import { EmployeeService } from '../services/employee.service';
import { AppStateService } from '../services/appstate.service';
import { adminDemoVideo } from './../constants/app.constant';

@Injectable()
export class CanActivateSuperAdmin implements CanActivate {
constructor(private _authService: AuthService, private _employeeService: EmployeeService, private _appState: AppStateService, private _service: CurriculumService, private _router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    this._appState.videoSource.next(adminDemoVideo);

    return this._authService.IsUserSuperAdmin().map(e => {

      if (e && e.IS_SUPER_ADMIN) {
        if (e.HAS_FROZEN) {
          this._router.navigate(["/access-frozen"]);
          return false;

        }
        else if (e.HAS_ACCESS === false || e.HAS_ACCESS === null) {
          //this.setExclusionListUrl(e.ExclusionListUrl);
          this._router.navigate(["/access-denied"]);
          return false;
        }
        else {
          this._employeeService.employeeSource.next(e);
          return true;
        }
      }
      else {
        //this.setExclusionListUrl(e.ExclusionListUrl);
        this._router.navigate(["/access-denied"]);
        return false;
      }
    }).catch((error) => {
      // this._router.navigate(["custom-error-page"]);
      return Observable.of(false);
    });
  }
}