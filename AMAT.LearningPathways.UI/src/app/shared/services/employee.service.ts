import { Injectable } from '@angular/core';
import {Http, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { IAdmin } from '../../admin/modal/IAdmin';
import { IEmployee } from '../../admin/services/ICurriculum';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EmployeeService {

    employeeSource = new BehaviorSubject<IEmployee>(undefined);
    employeeObservable = this.employeeSource.asObservable();

  constructor(private _http:Http) { }

 
}
