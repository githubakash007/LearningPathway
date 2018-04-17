import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ICurriculum } from '../../../admin/services/ICurriculum';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpInterceptorService } from '../../services/httpInterceptor.service';
import { ICourseDetail } from './IModalDialog';
import { apiAdminUrl } from './../../constants/featureBasedApiUrl.constant';
import { ApiUrl } from '../../enum/apiUrl.enum';


@Injectable()
export class ModalDialogService {
   
  modalObservable:BehaviorSubject<ICurriculum>  = new BehaviorSubject<ICurriculum>(undefined);
  constructor(private _interceptor: HttpInterceptorService) { }

  getCourseDetail(courseId:string){
     return this._interceptor.get<ICourseDetail>(this.getRelativeUrl(`${ApiUrl.courseDetail}${courseId}`)).first();
    
  }

//   getEmployeeDetail(employeeId:string){
//     return this._interceptor.get<ICourseDetail>(this.getRelativeUrl(`${ApiUrl.courseDetail}${courseId}`)).first();
   
//  }

  hideDialog(){

  }

  private getRelativeUrl(relativeUrl: ApiUrl | string): string {
    let featureUrl = apiAdminUrl;
    return featureUrl + relativeUrl.toString();
  }

}
