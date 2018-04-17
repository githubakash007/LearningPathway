import { Injectable } from '@angular/core';
import {Router, Resolve,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { ICurriculum, ICourse } from './services/ICurriculum';
import { CurriculumService } from './services/curriculum.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';

@Injectable()
export class AdminResolve implements Resolve<boolean> {
    constructor(private _service: CurriculumService,private _router:Router) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    //Observable<ICurriculum[]> | ICurriculum[] {
      Observable<boolean> | boolean{
       let roleId = route.params['id'];
      return this._service.getCurrentCourseFromStore().length > 0?true:
      this._service.getCurriculumList(roleId).map(data => this._service.setCurrentCourseToStore(data)).map(() => true)
      .catch(error => {
       this._router.navigate(['/admin/roles']);
        return Observable.of(false);
      })
    }
}