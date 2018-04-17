import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

import { LearnerCurriculumService } from './services/learner.service';
import { ILearnerCurriculum } from './modal/ILearnerCurriculum';
import { LearnerSkills } from './enum/learnerSkills.enum';

@Injectable()
export class LearnerCurriculumResolver implements Resolve<boolean> {
    constructor(private _learnerService: LearnerCurriculumService, private _router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        return this._learnerService.getCurrentCourseFromStore().length > 0 ? true :
            this._learnerService.getCurriculumList()
                .map(data => {
                    this._learnerService.loadInitialLearnerCurriculum(data);
                })
                .map(() => true)
                .catch(error => {
                    console.log(error);
                    return Observable.of(false);
                })
    }


}