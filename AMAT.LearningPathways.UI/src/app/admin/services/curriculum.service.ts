import { Injectable } from '@angular/core';
import { ICurriculum, ICourse, ISearchResult, IHistoryCurriculum, ISaveCurriculum, IEmployee, IFetchCurriculum, ICourseCatalog } from './ICurriculum';
import { Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Skills } from '../../shared/enum/skill.enum';
import { IRole } from '../modal/IRole';
import { ISearchCriteria } from '../modal/ISearchCriteria';
import { IAddNewCourse } from '../modal/IAddNewCourse';
import * as _ from 'lodash';
import { AdminApiName } from '../enum/adminApiName.enum';
import { apiAdminUrl } from './../../shared/constants/featureBasedApiUrl.constant';
import { HttpInterceptorService } from '../../shared/services/httpInterceptor.service';



@Injectable()
export class CurriculumService {

    curriculumList: ICurriculum[] = [];
    employeeSource = new BehaviorSubject<IEmployee>(undefined);
    employeeObservable = this.employeeSource.asObservable();
    private funcCourseCatalogSource = new BehaviorSubject<ICourseCatalog[]>(undefined);
    funcCourseCatalogObservable = this.funcCourseCatalogSource.asObservable();
    private foundationalCourseCatalogSource = new BehaviorSubject<ICourseCatalog[]>(undefined);
    foundationalCourseCatalogObservable = this.foundationalCourseCatalogSource.asObservable();
    private curriculumListSource = new BehaviorSubject<ICurriculum[]>(this.curriculumList);

    public historyCourseStore: IHistoryCurriculum[] = [];
    public currentCourseStore: ICurriculum[] = [];
    public SortedManatoryCourses: ICurriculum[] = [];

    public currentAdminRole: string = '';
    public currentAdminRoleCutOffHour: number = 0;
    public currentAdminRoleUid: string = ''

    public historyDataInputObj: IFetchCurriculum = { "CopyToRoleUID": '', "CopyFromRoleUID": '', "CalenderYear": 2018 };

    curriculumListObservable = this.curriculumListSource.asObservable();

    constructor(private _interceptor: HttpInterceptorService) { }

    getSearchResult(searchCriteria: ISearchCriteria): Observable<ISearchResult[]> {

        //return this._http.post(SearchCourseAPI, searchCriteria).map(val => <ISearchResult[]>val.json());
        return this._interceptor.post<ISearchResult[]>(this.getRelativeUrl(`${AdminApiName.SearchCourse.toString()}${this.currentAdminRoleUid}`), searchCriteria).map(val => val);

    }

    private getRelativeUrl(relativeUrl: AdminApiName | string): string {
        let featureUrl = apiAdminUrl;
        return featureUrl + relativeUrl.toString();
    }

    getCurriculumList(roleId: string): Observable<ICurriculum[]> {
        return this._interceptor.get<ICurriculum[]>(this.getRelativeUrl(`${AdminApiName.getCurriculum.toString()}${roleId}`))
            .catch(this.errorHandler)
    }

    getCourseCatalog(skillId: string): void {
         
        this._interceptor.get<ICourseCatalog[]>(this.getRelativeUrl(`${AdminApiName.getCourseCatalog.toString()}${skillId}`))
            .subscribe(input => {
                let skill =  skillId === '1'?'Foundational':'Functional';
                let alreadyAddedCourses = this.getCurrentCourseFromStore().filter(x => x.Skill === skill);
                input.forEach(x => {
                    if (alreadyAddedCourses.some(y => y.CourseId === x.CourseId)) {
                        x.visible = false;
                    }
                    else {
                        x.visible = true;
                    }

                });
                if(skill === 'Foundational'){
                    this.foundationalCourseCatalogSource.next(input);
                }
                else if(skill === 'Functional'){
                this.funcCourseCatalogSource.next(input);
                }
            });

    }
    getHistoryCurriculumList(input: IFetchCurriculum): Observable<IHistoryCurriculum[]> {

        let isClone: boolean = false;
        if (input && input.CopyFromRoleUID) {
            isClone = true;
        }

        if (isClone) {
            // return this._http.post(clonecurriculumAPI, input).map(val => <IHistoryCurriculum[]>val.json());
            return this._interceptor.post<IHistoryCurriculum[]>(this.getRelativeUrl(AdminApiName.clonecurriculum), input).map(val => val);
        }
        else {
            return this._interceptor.get<IHistoryCurriculum[]>(this.getRelativeUrl(`${AdminApiName.getHistoryCurriculum.toString()}${input.CopyToRoleUID}/${input.CalenderYear}`))
                .catch(this.errorHandler)
        }
    }



    getRoles(): Observable<IRole[]> {

        return this._interceptor.get<IRole[]>(this.getRelativeUrl(AdminApiName.getRoles))
            .catch(this.errorHandler)

    }

    // getCourseDetail(courseId: string): Observable<ICourseDetail> {
    //         return this._interceptor.get<ICourseDetail[]>(this.getRelativeUrl(`${AdminApiName.courseDetail}${courseId}`))
    //         .first()
    //         .catch(this.errorHandler)
    // }

    setInitialValue(list: ICurriculum[]): void {
        this.curriculumList = list;
        this.curriculumListSource.next(<ICurriculum[]>this.curriculumList);
    }

    saveChanges(): boolean {
        return true;
    }

    createPathway(callback: (result: boolean) => void): void {

        let list = this.getdata();

        if (this.SortedManatoryCourses && this.SortedManatoryCourses.length > 0) {
            let elctiveCourse = list.filter(x => x.IsMandatory === false);

            let sortedRequiredList = this.SortedManatoryCourses;
            if (sortedRequiredList) {
                sortedRequiredList.forEach((x, i) => x.CourseOrder = i + 1);
            }
            let electiveCounter = 0;
            if (elctiveCourse) {
                if (sortedRequiredList) {
                    electiveCounter = sortedRequiredList.length + 1;
                }

                elctiveCourse.forEach((x, i) => x.CourseOrder = electiveCounter + i);

            }

            this.curriculumList = [...sortedRequiredList, ...elctiveCourse];
        }
        else {
            this.curriculumList = list;
            this.curriculumList.forEach((x, i) => x.CourseOrder = i + 1);
        }


        //reorder the list before saving
        // if (list) {
        //     list.forEach((x, i) => x.CourseOrder = i);
        //     this.curriculumList = list;
        // }

        let saveList: ISaveCurriculum[] = [];
        for (let x of this.curriculumList) {
            let obj = { "UID": x.UID, "IsMandatory": x.IsMandatory, "CourseOrder": x.CourseOrder };
            saveList.push(obj);
        }

        //this._http.post(`${createPathAPI} ${this.currentAdminRoleCutOffHour}`, saveList).map(val => <boolean>val.json()).subscribe(
        this._interceptor.post<boolean>(this.getRelativeUrl(`${AdminApiName.createPath.toString()}${this.currentAdminRoleCutOffHour}`), saveList).subscribe(
            result => {
                if (result === true) {
                    this.curriculumList = [];
                    this.setHistoryCourseFromStore([]);
                    this.setCurrentCourseToStore([]);
                    callback(true);
                }
                else {
                    callback(false);
                }

            },
            error => {
                callback(false);
                this.processError(error)
            }

        );


    }

    saveCurriculum(callback: (result: boolean) => void): void {

        let list = this.getdata();
        if (this.SortedManatoryCourses && this.SortedManatoryCourses.length > 0) {
            let elctiveCourse = list.filter(x => x.IsMandatory === false);

            let sortedRequiredList = this.SortedManatoryCourses;
            if (sortedRequiredList) {
                sortedRequiredList.forEach((x, i) => x.CourseOrder = i + 1);
            }
            let electiveCounter = 0;
            if (elctiveCourse) {
                if (sortedRequiredList) {
                    electiveCounter = sortedRequiredList.length + 1;
                }

                elctiveCourse.forEach((x, i) => x.CourseOrder = electiveCounter + i);

            }

            this.curriculumList = [...sortedRequiredList, ...elctiveCourse];
        }
        else {
            this.curriculumList = list;
            this.curriculumList.forEach((x, i) => x.CourseOrder = i + 1);
        }
        this.curriculumListSource.next(<ICurriculum[]>this.curriculumList);
        //reorder the list before saving
        // if (list) {
        //     list.forEach((x, i) => x.CourseOrder = i);
        //     this.curriculumList = list;
        // }

        let saveList: ISaveCurriculum[] = [];
        for (let x of this.curriculumList) {
            let obj = { "UID": x.UID, "IsMandatory": x.IsMandatory, "CourseOrder": x.CourseOrder };
            saveList.push(obj);
        }
        let temp = 100;
        //this._http.post(`${createPathAPI} ${this.currentAdminRoleCutOffHour}`, saveList).map(val => <boolean>val.json()).subscribe(
        this._interceptor.post<boolean>(this.getRelativeUrl(`${AdminApiName.createPath.toString()}${this.currentAdminRoleCutOffHour}`), saveList).subscribe(
            result => {
                if (result === true) {
                    callback(true);
                }
                else {
                    callback(false);
                }

            },
            error => {
                callback(false);
                this.processError(error)
            }

        );


    }

    processError(error): void {

    }

    //definetely need to optimize
    MakeCourseMandatory(e: ICurriculum, callback: (result: boolean, msg: string) => void): void {

        let input = { "RoleCourseMappingUID": e.UID, "SetMandatoryFlag": true };

        this._interceptor.post<boolean>(this.getRelativeUrl(AdminApiName.togglemandatoryflag), input).subscribe(
            result => {
                if (result === true) {
                    this.curriculumList.find(x => x.CourseId === e.CourseId).IsMandatory = true;
                    this.curriculumListSource.next(this.curriculumList);
                    callback(true, "Course has been made mandatory successfully !");
                }
                else {
                    callback(false, "Course could not be made mandatory. Please contact the support team !!");
                }

            },
            error => {
                callback(false, "server error");
                this.processError(error)
            }

        );
    }

    makeCourseElective(e: ICurriculum, callback: (result: boolean, message: string) => void): void {

        let input = { "RoleCourseMappingUID": e.UID, "SetMandatoryFlag": false };

        this._interceptor.post<boolean>(this.getRelativeUrl(AdminApiName.togglemandatoryflag), input).subscribe(
            result => {
                if (result === true) {
                    this.curriculumList.find(x => x.CourseId === e.CourseId).IsMandatory = false;
                    this.curriculumListSource.next(this.curriculumList);
                    callback(true, "Course has been made elective successfully !");
                }
                else {
                    callback(false, "Course could not be made elective. Please contact the support team !!");
                }

            },
            error => {
                callback(false, "server error");
                this.processError(error)
            }

        );


    }

    toggleCourse(e: ICurriculum): void {
        let recordToggled: boolean = false;

        this.curriculumList.find(x => x.CourseId === e.CourseId).IsMandatory = !this.curriculumList.find(x => x.CourseId === e.CourseId).IsMandatory;

        this.curriculumListSource.next(this.curriculumList);
    }

    addNewCourseFromSearchResult(e: ISearchResult, callback: (result: boolean, isCourseExist: boolean) => void): void {

        if (!this.isCourseExist(e.CourseId)) {
            let newCourse: any = { "mappingId": e.CompetencyCourseMappingUID, "roleId": this.currentAdminRoleUID };


            //this._http.post(addNewCourseAPI, newCourse).map(val => <ICurriculum>val.json()).subscribe(
            this._interceptor.post<ICurriculum>(this.getRelativeUrl(AdminApiName.addNewCourse), newCourse).subscribe(
                item => {
                    if (item) {
                        this.curriculumList.push(item);
                        this.curriculumListSource.next(this.curriculumList);
                        callback(true, false);
                    }

                },
                error => {
                    callback(false, false);
                    this.processError(error)
                }

            );
        }
        else {
            callback(false, true);
        }

    }

    addNewCourseFromCatalog(e: ICourseCatalog, callback: (result: boolean, isCourseExist: boolean) => void): void {

        if (!this.isCourseExist(e.CourseId)) {
            let newCourse: any = { "mappingId": e.CourseUID, "roleId": this.currentAdminRoleUID };


            //this._http.post(addNewCourseAPI, newCourse).map(val => <ICurriculum>val.json()).subscribe(
            this._interceptor.post<ICurriculum>(this.getRelativeUrl(AdminApiName.addNewCourse), newCourse).subscribe(
                item => {
                    if (item) {
                        this.curriculumList.push(item);
                        this.refreshCourseCatalog(item.CourseId,item.Skill, false);
                        // refreshCallback(item.CourseId);
                        this.curriculumListSource.next(this.curriculumList);
                        callback(true, false);
                    }

                },
                error => {
                    callback(false, false);
                    this.processError(error)
                }

            );
        }
        else {
            callback(false, true);
        }

    }

    addNewCourseFromLastYear(e: IHistoryCurriculum, callback: (result: boolean, isCourseExist: boolean) => void): void {


        if (!this.isCourseExist(e.CourseId)) {

            let newCourse: IAddNewCourse = { "mappingId": e.UID };

            // this._http.post(addNewCourseFromLastYearAPI, newCourse).map(val => <ICurriculum>val.json()).subscribe(
            this._interceptor.post<ICurriculum>(this.getRelativeUrl(AdminApiName.addNewCourseFromLastYear), newCourse).subscribe(
                item => {
                    if (item) {
                        this.curriculumList.push(item);
                        // let historyData = this.getHistoryCourseFromStore();
                        if (this.historyCourseStore && this.historyCourseStore.indexOf(e) !== -1) {
                            this.historyCourseStore.find(x => x.CourseId === e.CourseId).visible = false;
                        }

                        callback(true, false);
                        this.curriculumListSource.next(this.curriculumList);


                    }

                },
                error => {
                    callback(false, false);
                    this.processError(error)
                }

            );
        }
        else {
            callback(false, true);

        }


    }

    isCourseExist(CourseId: string): boolean {
        let courseExist: boolean = false;

        this.curriculumList.forEach(x => {
            if (x.CourseId === CourseId) {
                courseExist = true;

            }
        });
        return courseExist

    }

    deleteCourseFromElective(course: ICurriculum, callback: (result: boolean) => void): void {

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let options = new RequestOptions({
            headers: headers
        });

        // this._http.delete(`${deleteCourseFromElectiveAPI}/${course.UID}`, options).map(val => <boolean>val.json()).subscribe(
        this._interceptor.delete<boolean>(this.getRelativeUrl(`${AdminApiName.deleteCourseFromElective.toString()}/${course.UID}`)).subscribe(
            result => {
                // need to optimize it
                this.removeItemfromCurrentCourses(course);
                this.ShowItemInHistoryCourses(course);
                this.refreshCourseCatalog(course.CourseId,course.Skill, true);
                this.curriculumListSource.next(this.curriculumList);
                callback(result);
            },
            error => {
                callback(false);
                this.processError(error)
            }

        );


    }

    refreshCourseCatalog(courseId: string,skill:string, visibility: boolean): void {
        if(skill === 'Foundational'){
            let courseCatalogList = this.foundationalCourseCatalogSource.getValue() || [];
            let result = courseCatalogList.find(x => x.CourseId === courseId);
            if (result !== undefined) {
                courseCatalogList.find(x => x.CourseId === courseId).visible = visibility;
                this.foundationalCourseCatalogSource.next(courseCatalogList);
            }
        }

        if(skill === 'Functional'){
            let courseCatalogList = this.funcCourseCatalogSource.getValue() || [];
            let result = courseCatalogList.find(x => x.CourseId === courseId);
            if (result !== undefined) {
                courseCatalogList.find(x => x.CourseId === courseId).visible = visibility;
                this.funcCourseCatalogSource.next(courseCatalogList);
            }
        }
        

    }

    errorHandler(error: any) {
        return Observable.throw(error || "Sever Error");
    }

    getdata(): ICurriculum[] {
        return this.curriculumList;
    }

    getCurrentCourseFromStore() {
        //return this.currentCourseStore;
        return this.curriculumList;
    }
    setCurrentCourseToStore(input: ICurriculum[]) {
        //this.currentCourseStore = input;
        this.curriculumList = input;
    }

    getHistoryCourseFromStore() {
        if (this.curriculumList) {
            //  this.historyCourseStore =this.historyCourseStore.filter(x => )
        }
        return this.historyCourseStore;
    }

    setHistoryCourseFromStore(input: IHistoryCurriculum[]) {
        this.historyCourseStore = input;
    }

    getSortedrequiredCourseFromStore() {

        return this.SortedManatoryCourses;
    }

    setSortedrequiredCourseToStore(input: ICurriculum[]) {
        this.SortedManatoryCourses = input;
    }

    get CurrentAdminRole() {
        return this.currentAdminRole;
    }
    set CurrentAdminRole(name: string) {
        this.currentAdminRole = name;
    }

    get currentAdminRoleUID() {
        return this.currentAdminRoleUid;
    }
    set currentAdminRoleUID(id: string) {
        this.currentAdminRoleUid = id;
    }

    get CurrentAdminRoleCutOffHour() {
        return this.currentAdminRoleCutOffHour;
    }
    set CurrentAdminRoleCutOffHour(hour: number) {
        this.currentAdminRoleCutOffHour = hour;
    }



    removeItemfromCurrentCourses(item: ICurriculum): boolean {
        if (this.curriculumList.indexOf(item) != -1) {
            this.curriculumList.splice(this.curriculumList.indexOf(item), 1);
            return true;
        }
        else {
            return false;
        }
    }
    ShowItemInHistoryCourses(course: ICurriculum): boolean {
        if (course && this.getHistoryCourseFromStore() && this.getHistoryCourseFromStore().find(x => x.CourseId === course.CourseId) !== undefined) {
            //course.IsActive = false;
            this.getHistoryCourseFromStore().find(x => x.CourseId === course.CourseId).visible = true;
            //this.getHistoryCourseFromStore().unshift(<IHistoryCurriculum>course);
            return true;
        }
        else {
            return false;
        }

    }

    getTotalHours(list: ICurriculum[]): number {
        let total = 0;
        total = list.reduce(((x, y) => x += y.Duration), 0);
        return total;
    }


    get historyDataInput() {
        return this.historyDataInputObj;
    }
    set historyDataInput(val: IFetchCurriculum) {
        this.historyDataInputObj = val;
    }

    refresh() {
        if (this.historyCourseStore) {
            this.historyCourseStore = _.orderBy<IHistoryCurriculum>(this.historyCourseStore, "CourseOrder", "asc");
        }
    }

}
