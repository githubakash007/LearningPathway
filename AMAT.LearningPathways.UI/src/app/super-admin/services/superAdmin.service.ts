import { Injectable } from '@angular/core';
import { HttpInterceptorService } from '../../shared/services/httpInterceptor.service';
import { Observable } from 'rxjs/Observable';
import { map } from "rxjs/operators";
import { IEmployee } from '../employee/model/IEmployee.modal';
import { ICourseCatalog } from '../coursecatalog/model/ICourseCatalog.modal';
import { SuperAdminApiName } from '../enum/superAdminApiName.enum';
import { apiSuperAdminUrl } from './../../shared/constants/featureBasedApiUrl.constant';
import { HttpClient, HttpParams } from "@angular/common/http";
import { IFilterEmployeeCriteria } from '../employee/model/IFilterEmployeeCriteria';
import { IFilterCoursesCriteria } from '../coursecatalog/model/IFilterCoursesCriteria';
import { IEmployeeDetails } from '../../shared/model/fileupload.interface'
import { ICourse } from '../../admin/services/ICurriculum';

@Injectable()
export class SuperAdminService {

    constructor(private _interceptor: HttpInterceptorService) {

    }

    getEmployeeList(): Observable<IEmployee[]> {
        return this._interceptor.get<IEmployee[]>(this.getRelativeUrl(SuperAdminApiName.getEmployeeList));
    }

    getAlltEmployeeList(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<IEmployee[]> {


        let inputData: IFilterEmployeeCriteria = { FilterKey: filter, PageNumber: pageNumber, PageSize: pageSize, SortOrder: sortOrder };
        return this._interceptor.post<IEmployee[]>(this.getRelativeUrl(SuperAdminApiName.filterEmployees), inputData).pipe(
            map(res => res)
        );
    }


    UpdateEmployee(inputData: IEmployee,callback: (result: boolean) => void):void {
         this._interceptor.post<boolean>(this.getRelativeUrl(SuperAdminApiName.updateEmployee), inputData).subscribe(result => {
             if(result){
                callback(true);
             }
        });
    }

    private getRelativeUrl(relativeUrl: SuperAdminApiName | string): string {
        let featureUrl = apiSuperAdminUrl;
        return featureUrl + relativeUrl.toString();
    }



    getAllCourseList(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<ICourseCatalog[]> {


        let inputData: IFilterCoursesCriteria = {  FilterKey: filter, PageNumber: pageNumber, PageSize: pageSize, SortOrder: sortOrder};
        return this._interceptor.post<ICourseCatalog[]>(this.getRelativeUrl(SuperAdminApiName.filterCourses), inputData).pipe(
            map(res => res)
        );
    }
    getCourseList(): Observable<ICourseCatalog[]> {
        return this._interceptor.get<ICourseCatalog[]>(this.getRelativeUrl(SuperAdminApiName.getCourseList));
    }
    UpdateCourse(input:ICourseCatalog[], callback:(result:boolean)=>void):void{
        this._interceptor.post<boolean>(this.getRelativeUrl(SuperAdminApiName.updateCourse), input).subscribe(result => {
            if(result){
               callback(true);
            }
       });
    }


    submitFileUpload(inputData: IEmployeeDetails[], callback: (result: boolean) => void): void {
        this._interceptor.post<boolean>(this.getRelativeUrl(SuperAdminApiName.submitFileUpload), inputData).subscribe(result => {
            if (result) {
                callback(true);
            }
        });
    }

}

