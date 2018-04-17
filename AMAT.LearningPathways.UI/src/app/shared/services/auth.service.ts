import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
//import {IsUserAdminAPI,CheckUserTypeIsLearnerAPI} from './../constants/adminAPI.constants';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { IAdmin } from '../../admin/modal/IAdmin';
import { IEmployee } from '../../admin/services/ICurriculum';
import { HttpInterceptorService } from './httpInterceptor.service';
import { ApiUrl } from '../enum/apiUrl.enum';
import { apiAuthUrl } from './../constants/featureBasedApiUrl.constant';
import { AppStateService } from './appstate.service';

@Injectable()
export class AuthService {

  private isUserAdmin: boolean = false;

  constructor(private _interceptor: HttpInterceptorService) { }

  IsUserAdmin(): Observable<IEmployee> {
    return this._interceptor.get<IEmployee>(this.getRelativeUrl(ApiUrl.IsUserAdmin));
  }

  IsUserLearner(): Observable<IEmployee> {
    return this._interceptor.get<IEmployee>(this.getRelativeUrl(ApiUrl.IsUserLearner));
  }

  //For manager Page to fecth manager details
  GetManagerDetails(): Observable<IEmployee> {
    return this._interceptor.get<IEmployee>(this.getRelativeUrl(ApiUrl.GetManagerDetails));
  }

  private getRelativeUrl(relativeUrl: ApiUrl | string): string {
    let featureUrl = apiAuthUrl;
    return featureUrl + relativeUrl.toString();
  }

  IsUserSuperAdmin(): Observable<IEmployee> {
    return this._interceptor.get<IEmployee>(this.getRelativeUrl(ApiUrl.IsUserSuperAdmin));
  }

}
