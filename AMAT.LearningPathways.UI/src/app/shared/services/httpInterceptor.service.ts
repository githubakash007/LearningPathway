import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiUrl } from '../enum/apiUrl.enum';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpInterceptorService {

  constructor(private _http: Http) { }

  get<T>(relativeUrl: string): Observable<T> {

    //const baseUrl = environment.apiBaseUrl + environment.apiAuthUrl;
    let apiUrl = environment.apiBaseUrl + relativeUrl;
    return this._http.get(apiUrl).map(res => <T>res.json());
  }

  post<T>(relativeUrl: string, inputData: any): Observable<T> {
   // const baseUrl = environment.apiBaseUrl + environment.apiAuthUrl;
    let apiUrl = environment.apiBaseUrl + relativeUrl;
    if (inputData === undefined) {
      return this._http.post(apiUrl, undefined).map(res => <T>res.json());
    }
    else {
      return this._http.post(apiUrl, inputData).map(res => <T>res.json());
    }

  }

  delete<T>(relativeUrl: string): Observable<T> {
    //const baseUrl = environment.apiBaseUrl + environment.apiAuthUrl;
    let apiUrl = environment.apiBaseUrl + relativeUrl;
    return this._http.delete(apiUrl).map(res => <T>res.json());
  }

}



