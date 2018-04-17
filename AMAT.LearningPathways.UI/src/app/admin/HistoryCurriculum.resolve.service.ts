import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ICurriculum, ICourse, IHistoryCurriculum, IFetchCurriculum } from './services/ICurriculum';
import { CurriculumService } from './services/curriculum.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';
import * as _ from 'lodash';

@Injectable()
export class HistoryCurriculumResolver implements Resolve<boolean> {
  constructor(private _service: CurriculumService, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let roleUid = route.params['id'];

    if (!this._service.currentAdminRole) {
      if (sessionStorage.getItem(String(roleUid)) !== null) {
        this._service.currentAdminRole = sessionStorage.getItem(String(roleUid));
      }
    }

    if (this._service.currentAdminRoleCutOffHour === 0) {
      if (sessionStorage.getItem(String(roleUid)+'cutoff') !== null) {
        this._service.currentAdminRoleCutOffHour = +sessionStorage.getItem(String(roleUid)+'cutoff');
      }
    }

    this._service.currentAdminRoleUID = roleUid;
    let input: IFetchCurriculum = this._service.historyDataInputObj;
    input.CopyToRoleUID = roleUid;
    return this._service.getHistoryCourseFromStore().length > 0 ? true :
      this._service.getHistoryCurriculumList(input)
        .map(data => {
          if (this._service.getCurrentCourseFromStore().length === 0) {
            this._service.setCurrentCourseToStore(this.getCurrentCourses(data));
          }
          this._service.setHistoryCourseFromStore(this.SetVisibility(data));

        })
        .map(() => true) //Need to clarify on this
        .catch(error => {
          // console.log(`History Curriculum data retrival error ${error}`);
          this._router.navigate(['/admin/roles']);
          return Observable.of(false);
        })
  }

  private ConvertHistoryToCurrent(currentCourses: IHistoryCurriculum[]): ICurriculum[] {

    const curriculumList: ICurriculum[] = currentCourses;

    return curriculumList;
  }

  SetVisibility(input: IHistoryCurriculum[]): IHistoryCurriculum[] {
    let currentCourses = input.filter(x => x.IsActive === true);
    let historyCourses = input.filter(x => x.IsActive === false);
    historyCourses.forEach(x => {
      if (currentCourses.some(y => y.CourseId === x.CourseId)) {
        x.visible = false;
      }
      else {
        x.visible = true;
      }

    });
    return historyCourses;
  }

  getCurrentCourses(input: IHistoryCurriculum[]): ICurriculum[] {
    const curriculumList: ICurriculum[] = input.filter(x => x.IsActive === true);
    let sortedList = _.orderBy<ICurriculum>(curriculumList, "CourseOrder", "asc");
    return sortedList;

  }

}