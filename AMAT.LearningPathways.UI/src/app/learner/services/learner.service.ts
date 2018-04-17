import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ILearnerCurriculum, IEmployeeList } from '../modal/ILearnerCurriculum';
import { LearnerApiName } from './../enum/learnerApiName.enum';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IEmployee } from '../../admin/services/ICurriculum';
import { LearnerSkills } from '../enum/learnerSkills.enum';
import { apiLearnerUrl } from './../../shared/constants/featureBasedApiUrl.constant';
import { HttpInterceptorService } from '../../shared/services/httpInterceptor.service';
import { ILearnerSearchResult } from '../modal/ILearnerSearchResult';
import { ISearchCriteria } from '../../admin/modal/ISearchCriteria';
import { ValidationMessageType } from '../enum/validationMessageType.enum';
import { maxFoundationalElectiveCourseCount } from '../constants/learner.constant';
import * as _ from 'lodash';

@Injectable()
export class LearnerCurriculumService {

  learnerCurriculumList: ILearnerCurriculum[] = [];
  private learnerCurriculumListSource = new BehaviorSubject<ILearnerCurriculum[]>(this.learnerCurriculumList);
  learnerCurriculumListObservable = this.learnerCurriculumListSource.asObservable();
  selectedFunctionalElectiveCourseCount: number = 0;
  selectedFoundationalElectiveCourseCount: number = 0;
  //For validation against ceiling of 40 hr
  functionalFoundationalHours: number = 0;
  totalSelectedCourseHours: number = 0;
  maxAllowedHours: number = 40;
  currentUrl: string = '';
  prevUrl: string = '';

  //totalElectiveCourseCount:number=0;
  totalFoundationalElectiveCount: number = 0;
  totalFunctionalElectiveCount: number = 0;

  //for displaying employeelist under manager
  employeeListForApproval: IEmployeeList[] = [];
  private employeeListForApprovalSource = new BehaviorSubject<IEmployeeList[]>(this.employeeListForApproval);
  employeeListForApprovalObservable = this.employeeListForApprovalSource.asObservable();

  constructor(private _interceptor: HttpInterceptorService) { }

  getEmployeeListForApproval(): Observable<IEmployeeList[]> {
    return this._interceptor.get<IEmployeeList[]>(this.getRelativeUrl(LearnerApiName.getEmployeeListForApproval));
  }

  getCurrentEmployeeDetails(currentEmployeeData: IEmployeeList): Observable<ILearnerCurriculum[]> {
    return this._interceptor.post<ILearnerCurriculum[]>(this.getRelativeUrl(LearnerApiName.getCurrentEmployeeDetails), currentEmployeeData);
  }

  approveCourseSelection(currentEmployeeList: IEmployeeList, callback: (result: boolean) => void): void {

    //let EmployeeId: any = { "EMPLOYEE_ID": currentEmployeeList.EMPLOYEE_ID};

    this._interceptor.post<boolean>(this.getRelativeUrl(`${LearnerApiName.approveCourseSelection.toString()}${currentEmployeeList.EMPLOYEE_ID}`), null).subscribe(
      //`${LearnerApiName.removeElectiveCourse.toString()}${course.CourseUID}`
      item => {
        if (item) {
          // this.learnerCurriculumList.push(item);
          //this.learnerCurriculumListSource.next(this.learnerCurriculumList);
          callback(true);
        }
      },
      error => {
        callback(false);
        this.processError(error)
      }
    );
  }
  submitSuggestChanges(currentEmployeeList: IEmployeeList, comments: string, callback: (result: boolean) => void): void {

    let rejectSelection: any = { "EmployeeId": currentEmployeeList.EMPLOYEE_ID, "Comments": comments };

    this._interceptor.post<boolean>(this.getRelativeUrl(LearnerApiName.submitSuggestChanges), rejectSelection).subscribe(
      item => {
        if (item) {
          // this.learnerCurriculumList.push(item);
          //this.learnerCurriculumListSource.next(this.learnerCurriculumList);
          callback(true);
        }
      },
      error => {
        callback(false);
        this.processError(error)
      }
    );
  }

  getTotalHoursForSelectedCoursesForManager(functionalCourses: ILearnerCurriculum[], foundationalCourses: ILearnerCurriculum[], enrichmentCourses: ILearnerCurriculum[]): number {
    let arr1 = Object.assign([], functionalCourses.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)] && ((x.IsMandatory === true || x.IsSelected === true) && x.IsCourseCompleted === false)));
    let arr2 = Object.assign([], foundationalCourses.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)] && ((x.IsMandatory === true || x.IsSelected === true) && x.IsCourseCompleted === false)));
    let arr3 = Object.assign([], enrichmentCourses.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)] && x.IsSelected === true && x.IsCourseCompleted === false));

    return this.getSum(arr1) + this.getSum(arr2) + this.getSum(arr3);
  }

  getCurriculumList(): Observable<ILearnerCurriculum[]> {
    return this._interceptor.get<ILearnerCurriculum[]>(this.getRelativeUrl(LearnerApiName.getCurriculum));
  }

  private getRelativeUrl(relativeUrl: LearnerApiName | string): string {
    let featureUrl = apiLearnerUrl;
    return featureUrl + relativeUrl.toString();
  }

  addElectiveCourse(course: ILearnerCurriculum, callback: (result: boolean, message: string) => void): void {

    if (course.IsCourseCompleted === true) {
      this.learnerCurriculumList.find(x => x.CourseUID === course.CourseUID).IsSelected = true;
      this.learnerCurriculumListSource.next(this.learnerCurriculumList);
      return callback(true, '');
    }

    if (this.getTotalHoursForSelectedCourses() < this.maxAllowedHours) {

      let newCourse: any = { "CourseUID": course.CourseUID, "RoleCourseMappingUID": course.UID, "SkillUID": course.SkillUid };
      this._interceptor.post<ILearnerCurriculum>(this.getRelativeUrl(LearnerApiName.addElectiveCourse), newCourse).subscribe(
        item => {
          if (item) {
            this.learnerCurriculumList.find(x => x.CourseUID === course.CourseUID).IsSelected = true;
            this.learnerCurriculumListSource.next(this.learnerCurriculumList);
            callback(true, '');
          }

        },
        error => {
          callback(false, 'Adding new course has failed. please contact the support team !!');
          this.processError(error)
        }
      )
    }
    else {
      callback(false, "You have reached the Pathway duration limit of 40 hours of learning this year. To add a particular course, please remove course(s) of the equal duration from your Pathway before continuing.")
    }
  }

  deleteElectiveCourse(course: ILearnerCurriculum, element: any, callback: (result: boolean, e: any) => void): void {
    if (course.IsCourseCompleted === true) {
      this.learnerCurriculumList.find(x => x.CourseUID === course.CourseUID).IsSelected = false;
      this.learnerCurriculumListSource.next(this.learnerCurriculumList);
      return callback(true, element);
    }
    // else{
    let newCourse: any = { "CourseUID": +course.CourseUID, "RoleCourseMappingUID": null, "SkillUID": course.SkillUid };
    this._interceptor.delete<boolean>(this.getRelativeUrl(`${LearnerApiName.removeElectiveCourse.toString()}${course.CourseUID}`)).subscribe(
      item => {
        if (item) {
          this.learnerCurriculumList.find(x => x.CourseUID === course.CourseUID).IsSelected = false;
          this.learnerCurriculumListSource.next(this.learnerCurriculumList);
          callback(true, element);
        }

      },
      error => {
        callback(false, element);
        this.processError(error)
      }
    )
    // }
  }

  getEnrichmentCourses(skillId?: string): Observable<ILearnerCurriculum[]> {
    return this._interceptor.get<ILearnerCurriculum[]>(this.getRelativeUrl(LearnerApiName.getEnrichmentCourses));
  }

  getSearchResult(searchCriteria: ISearchCriteria): Observable<ILearnerSearchResult[]> {
    return this._interceptor.post<ILearnerSearchResult[]>(this.getRelativeUrl(LearnerApiName.SearchEnrichmentCourse), searchCriteria).map(val => val);
  }

  addEnrichmentCourse(course: ILearnerCurriculum, callback: (result: boolean, message: string) => void): void {

    if (this.getTotalHoursForSelectedCourses() < this.maxAllowedHours) {
      let newCourse: any = { "CourseUID": course.CourseUID, "RoleCourseMappingUID": null, "SkillUID": course.SkillUid };

      //let body = JSON.stringify(e.CompetencyCourseMappingUID);
      this._interceptor.post<ILearnerCurriculum>(this.getRelativeUrl(LearnerApiName.addElectiveCourse), newCourse).subscribe(
        item => {
          if (item) {
            this.learnerCurriculumList.find(x => x.CourseId === item.CourseId).IsSelected = true;
            this.learnerCurriculumListSource.next(this.learnerCurriculumList);
            callback(true, "");
          }

        },
        error => {
          callback(false, "Adding new course has failed. please contact the support team !!");
          this.processError(error)
        }

      );
    }
    else {
      callback(false, "You have reached the Pathway duration limit of 40 hours of learning this year. To add a particular course, please remove course(s) of the equal duration from your Pathway before continuing.")
    }



  }

  addNewEnrichmentCourseFromSearchResult(course: ILearnerSearchResult, callback: (result: boolean, isCourseExist: boolean) => void): void {

    if (!this.isEnrichmentCourseAlreadySelected(course.CourseId)) {
      let newCourse: any = { "CourseUID": course.CourseUID, "RoleCourseMappingUID": null, "SkillUID": course.SkillUid };

      this._interceptor.post<ILearnerSearchResult>(this.getRelativeUrl(LearnerApiName.addElectiveCourse), newCourse).subscribe(
        item => {
          if (item) {
            if (this.isEnrichmentCourseExist(item.CourseId)) {
              this.learnerCurriculumList.find(x => x.CourseId === item.CourseId).IsSelected = true;
            }
            else {
              this.learnerCurriculumList.push(item);
            }
            this.learnerCurriculumListSource.next(this.learnerCurriculumList);
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

  submitCurriculum(callback: (result: boolean) => void, validationCallBack: (msg: string) => void): void {

    if (this.getTotalHoursForSelectedCourses() < this.maxAllowedHours && !this.isPathwaySubmissionValid()) {
      validationCallBack(`You cannot submit pathway before adding required number of foundational electives (${this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount)}) courses for your pathway`);
    }

    else {

      if (this.getTotalHoursForSelectedCourses() >= this.maxAllowedHours) {
        this._interceptor.post<boolean>(this.getRelativeUrl(LearnerApiName.submitCurriculum), undefined).subscribe(
          item => {
            if (item) {
              callback(true);
            }

          },
          error => {
            callback(false);
            this.processError(error)
          }

        );
      }
      else {
        validationCallBack(`Please add required ${this.maxAllowedHours} hrs of courses into your pathways before submitting it`);
      }
    }
  }

  resetLearnerPathway(callback: (status: boolean) => void): void {

    this._interceptor.post<ILearnerCurriculum[]>(this.getRelativeUrl(LearnerApiName.resetPathway), undefined).subscribe(
      curriculum => {
        if (curriculum && curriculum.length > 0) {
          this.loadInitialLearnerCurriculum(curriculum);
          callback(true);
        }

      },
      error => {
        callback(false);
        this.processError(error)
      }

    );
  }



  setInitialValue(): void {
    // this.learnerCurriculumList = list;
    this.learnerCurriculumListSource.next(this.learnerCurriculumList);
  }
  getLearnerCurriculum(): ILearnerCurriculum[] {
    return this.learnerCurriculumList;
  }

  errorHandler(error: any) {
    return Observable.throw(error || "Sever Error");
  }
  processError(error): void {

  }

  getCurrentCourseFromStore() {
    return this.learnerCurriculumList;
  }
  setCurrentCourseToStore(input: ILearnerCurriculum[]) {
    this.learnerCurriculumList = input;
  }

  getFiftyPercentageOfElectiveCourses(input: number): number {
    let result = 0;
    result = Math.round((input) / 2);
    //result = Math.floor((input) / 2);
    if (result > maxFoundationalElectiveCourseCount) {
      result = maxFoundationalElectiveCourseCount;
    }
    return result;
  }

  getTotalHoursForSelectedCourses(): number {
    let arr1 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)] && ((x.IsMandatory === true || x.IsSelected === true) && x.IsCourseCompleted === false)));
    let arr2 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)] && ((x.IsMandatory === true || x.IsSelected === true) && x.IsCourseCompleted === false)));
    let arr3 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)] && x.IsSelected === true && x.IsCourseCompleted === false));

    return this.getSum(arr1) + this.getSum(arr2) + this.getSum(arr3);
    //this.totalSelectedCourseHours = this.getSum(arr1) + this.getSum(arr2) + this.getSum(arr3);
  }

  getTotalCostForSelectedCourses(): number {
    let arr1 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)] && ((x.IsMandatory === true || x.IsSelected === true) && x.IsCourseCompleted === false)));
    let arr2 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)] && ((x.IsMandatory === true || x.IsSelected === true) && x.IsCourseCompleted === false)));
    let arr3 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)] && x.IsSelected === true && x.IsCourseCompleted === false));

    return this.getTotalCost(arr1) + this.getTotalCost(arr2) + this.getTotalCost(arr3);
    //this.totalSelectedCourseHours = this.getSum(arr1) + this.getSum(arr2) + this.getSum(arr3);
  }

  getFunctionalFoundationalTotalHours(): number {
    let arr1 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)] && (x.IsMandatory === true || x.IsSelected === true)));
    let arr2 = Object.assign([], this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Foundational)] && (x.IsMandatory === true || x.IsSelected === true)));
    //this.functionalFoundationalHours = this.getSum(arr1) + this.getSum(arr2);
    return this.getSum(arr1) + this.getSum(arr2);
  }

  getTotalCost(input: ILearnerCurriculum[]): number {
    let total: number = 0;
    if (input && input.length > 0) {
      total = input.reduce(((sum, val) => sum += val.BasePrice), 0)
    }
    if (total > 0) {
      total = Math.round(total * 10) / 10;
    }
    return total;
  }

  getSum(input: ILearnerCurriculum[]): number {
    let total: number = 0;
    if (input && input.length > 0) {
      total = input.reduce(((sum, val) => sum += val.Duration), 0)
    }
    if (total > 0) {
      total = Math.round(total * 10) / 10;
    }
    return total;
  }

  //Validation functions
  isCourseAdditionValid(courseType: string): boolean {
    let allowedCount = 0;
    let currentCount = 0;
    let isValid: boolean = false;

    if (courseType === LearnerSkills[LearnerSkills.Functional]) {
      //allowedCount = this.getFiftyPercentageOfElectiveCourses(this.totalFunctionalElectiveCount);
      //currentCount = this.selectedFunctionalElectiveCourseCount;
      allowedCount = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);
      currentCount = this.selectedFoundationalElectiveCourseCount;
      isValid = allowedCount === currentCount;
    }
    else if (courseType === LearnerSkills[LearnerSkills.Foundational]) {
      allowedCount = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);
      currentCount = this.selectedFoundationalElectiveCourseCount;
      isValid = allowedCount > currentCount;
    }
    return isValid;
  }

  isPathwaySubmissionValid(): boolean {
    let allowedCount = 0;
    let currentCount = 0;
    let isValid: boolean = false;
    allowedCount = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);
    currentCount = this.selectedFoundationalElectiveCourseCount;
    isValid = allowedCount === currentCount;
    return isValid;
  }

  isEnrichmentCourseExist(CourseId: string): boolean {
    let courseExist: boolean = false;
    let enrichmentList = this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)]);
    enrichmentList.forEach(x => {
      if (x.CourseId === CourseId) {
        courseExist = true;

      }
    });
    return courseExist

  }

  isEnrichmentCourseAlreadySelected(CourseId: string): boolean {
    let courseExist: boolean = false;
    let enrichmentList = this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Enrichment)] && x.IsSelected === true);
    enrichmentList.forEach(x => {
      if (x.CourseId === CourseId) {
        courseExist = true;

      }
    });
    return courseExist

  }

  allowEnrichmnetCourse(): ValidationMessageType {

    let allow: boolean = false;
    let result: ValidationMessageType;
    if (this.getTotalHoursForSelectedCourses() >= this.maxAllowedHours) {
      result = ValidationMessageType.reachedMaxAllowedHours;
      //allow = false;
    }
    else {
      let totalRequiredCourses = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);// + this.getFiftyPercentageOfElectiveCourses(this.totalFunctionalElectiveCount);
      let currentCount = this.selectedFoundationalElectiveCourseCount; //+ this.selectedFunctionalElectiveCourseCount;
      allow = totalRequiredCourses === currentCount;
      result = allow ? ValidationMessageType.additionIsValid : ValidationMessageType.funcFoundNotCountCompleted;
    }
    return result;
  }

  allowFunctionalCourse(): ValidationMessageType {

    let allow: boolean = false;
    let result: ValidationMessageType;
    if (this.getTotalHoursForSelectedCourses() >= this.maxAllowedHours) {
      result = ValidationMessageType.reachedMaxAllowedHours;
      //allow = false;
    }
    else {
      let totalRequiredCourses = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);// + this.getFiftyPercentageOfElectiveCourses(this.totalFunctionalElectiveCount);
      let currentCount = this.selectedFoundationalElectiveCourseCount; //+ this.selectedFunctionalElectiveCourseCount;
      allow = totalRequiredCourses === currentCount;
      result = allow ? ValidationMessageType.additionIsValid : ValidationMessageType.funcFoundNotCountCompleted;
    }
    return result;
  }

  getSearchResultForFunctionalSkill(searchCriteria: ISearchCriteria): Observable<ILearnerSearchResult[]> {
    return this._interceptor.post<ILearnerSearchResult[]>(this.getRelativeUrl(LearnerApiName.SearchFunctionalCourse), searchCriteria).map(val => val);
  }

  addNewFunctionalCourseFromSearchResult(course: ILearnerSearchResult, callback: (result: boolean, isCourseExist: boolean) => void): void {

    if (!this.isFunctionalCourseAlreadySelected(course.CourseId)) {
      let newCourse: any = { "CourseUID": course.CourseUID, "RoleCourseMappingUID": null, "SkillUID": course.SkillUid };

      this._interceptor.post<ILearnerSearchResult>(this.getRelativeUrl(LearnerApiName.addElectiveCourse), newCourse).subscribe(
        item => {
          if (item) {
            if (this.isFunctionalCourseExist(item.CourseId)) {
              this.learnerCurriculumList.find(x => x.CourseId === item.CourseId).IsSelected = true;
            }
            else {
              this.learnerCurriculumList.push(item);
            }
            this.learnerCurriculumListSource.next(this.learnerCurriculumList);
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



  isFunctionalCourseAlreadySelected(CourseId: string): boolean {
    let courseExist: boolean = false;
    let functionalList = this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)] && x.IsSelected === true);
    functionalList.forEach(x => {
      if (x.CourseId === CourseId) {
        courseExist = true;
      }
    });
    return courseExist
  }

  isFunctionalCourseExist(CourseId: string): boolean {
    let courseExist: boolean = false;
    let functionalList = this.learnerCurriculumList.filter(x => x.Skill === LearnerSkills[(LearnerSkills.Functional)]);
    functionalList.forEach(x => {
      if (x.CourseId === CourseId) {
        courseExist = true;
      }
    });
    return courseExist
  }

  setEmployeeListForApproval(input: IEmployeeList[]) {
    this.employeeListForApproval = input;
  }

  getEmployeeListApproval() {
    return this.employeeListForApproval;
  }

  // Will see, if we can optimize the below code a bit
  getCurrentCourses(input: ILearnerCurriculum[]): ILearnerCurriculum[] {

    let requiredFoundationalElectiveCount = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);
    let foundationalCount = 0;
    let currentFoundationalCount = input.filter(x => x.Skill === LearnerSkills[LearnerSkills.Foundational] && x.IsMandatory === false && x.IsSelected === true).length;

    let requiredFunctionalElectiveCount = this.getFiftyPercentageOfElectiveCourses(this.totalFunctionalElectiveCount);
    let functionalCount = 0;
    let currentFunctionalCount = input.filter(x => x.Skill === LearnerSkills[LearnerSkills.Functional] && x.IsMandatory === false && x.IsSelected === true).length;
    let arr = input.map(x => {
      if (x.Skill === LearnerSkills[LearnerSkills.Foundational] && x.IsMandatory === false && x.IsCourseCompleted === true && x.IsSelected === false && foundationalCount < requiredFoundationalElectiveCount && currentFoundationalCount < requiredFoundationalElectiveCount) {
        x.IsSelected = true;
        foundationalCount += 1;
        currentFoundationalCount += 1;
      }
      else if (x.Skill === LearnerSkills[LearnerSkills.Functional] && x.IsMandatory === false && x.IsCourseCompleted === true && x.IsSelected === false && functionalCount < requiredFunctionalElectiveCount && currentFunctionalCount < requiredFunctionalElectiveCount) {
        x.IsSelected = true;
        functionalCount += 1;
        currentFunctionalCount += 1;
      }
      return x;
    });

    let sortedList = _.orderBy<ILearnerCurriculum>(arr, "CourseOrder", "asc");
    return sortedList;
  }

  RemoveCompletedCourses(input: ILearnerCurriculum[]): ILearnerCurriculum[] {

    let requiredFoundationalElectiveCount = this.getFiftyPercentageOfElectiveCourses(this.totalFoundationalElectiveCount);
    let foundationalCount = 0;
    let currentFoundationalCount = input.filter(x => x.Skill === LearnerSkills[LearnerSkills.Foundational] && x.IsMandatory === false && x.IsSelected === true).length;

    let requiredFunctionalElectiveCount = this.getFiftyPercentageOfElectiveCourses(this.totalFunctionalElectiveCount);
    let functionalCount = 0;
    let currentFunctionalCount = input.filter(x => x.Skill === LearnerSkills[LearnerSkills.Functional] && x.IsMandatory === false && x.IsSelected === true).length;
    let arr = [];

    if (currentFoundationalCount > requiredFoundationalElectiveCount) {
      let count = currentFoundationalCount - requiredFoundationalElectiveCount;
      let removed = 0;
      arr = input.map(x => {
        if (x.Skill === LearnerSkills[LearnerSkills.Foundational] && x.IsMandatory === false && x.IsCourseCompleted === true && x.IsSelected === true && removed < count) {
          x.IsSelected = false;
          removed += 1;
        }
        return x;
      });
      //set iscompleted course  isselected to false
    }
    else {
      arr = input;
    }

    let sortedList = _.orderBy<ILearnerCurriculum>(arr, "CourseOrder", "asc");
    return sortedList;
  }

  setGlobalVariables(input: ILearnerCurriculum[]): void {
    this.totalFoundationalElectiveCount =
      input.filter(x => x.Skill === LearnerSkills[LearnerSkills.Foundational] && x.IsMandatory === false).length;
    this.totalFunctionalElectiveCount =
      input.filter(x => x.Skill === LearnerSkills[LearnerSkills.Functional] && x.IsMandatory === false).length;
  }

  loadInitialLearnerCurriculum(curriculum: ILearnerCurriculum[]) {
    if (curriculum && curriculum.length > 0) {
      this.setGlobalVariables(curriculum);
      this.setCurrentCourseToStore(this.RemoveCompletedCourses(this.getCurrentCourses(curriculum)));
      this.learnerCurriculumList = this.getCurrentCourseFromStore();
    }
  }


}
