import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ICourseCatalog } from '../model/ICourseCatalog.modal';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SuperAdminService } from '../../services/superAdmin.service';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort, MatSortable, PageEvent, MatDialog, MatDialogRef } from '@angular/material';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from "rxjs/observable/merge";
import { CourseEditComponent } from '../course-edit/course-edit.component';
import { CourseAddComponent } from '../course-add/course-add.component';
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  coursedatasource : CourseDataSource;
  displayedColumn = ['aguCode', 'courseName','environment','skillName', 'duration','basePrice','isDeactivated','buttons'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private route: ActivatedRoute, private _superAdminService: SuperAdminService, private _matDialog: MatDialog) { }
  openEmployeeDetail(crs: ICourseCatalog) {
    let dialogRef = this._matDialog.open(CourseEditComponent, {
      width: '60%',
      height:'auto',
      data: crs
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let foundIndex = this.coursedatasource.courseSubject.value.findIndex(x => x.AGU_CODE === result.AGU_CODE);
        this.coursedatasource.courseSubject.value[foundIndex] = <ICourseCatalog>result;
        this.coursedatasource.courseSubject.next(this.coursedatasource.courseSubject.value);
      }
    });

  }
  openCourseAdd() {
    let dialogRef = this._matDialog.open(CourseAddComponent, {
      width: '60%',
      height:'auto',
    });
  }

 

  ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
    .pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadCoursePage();
      })
    ).subscribe();


    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      tap(()=> this.loadCoursePage())
    ).subscribe()
  }
  loadCoursePage(){
    this.coursedatasource.loadCourse(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    )
  }

  ngOnInit() {
    this.coursedatasource = new CourseDataSource(this._superAdminService);
    this.coursedatasource.loadCourse('','asc',0,10);
  }

  getCourseList(): Observable<ICourseCatalog[]>{
    return this._superAdminService.getCourseList();
  }

}
export class CourseDataSource extends DataSource<ICourseCatalog> {
  public courseSubject = new BehaviorSubject<ICourseCatalog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading = this.loadingSubject.asObservable();
  public totalCount: number = 0;

  constructor(private _superAdminService: SuperAdminService){
    super();
  }

  loadCourse(filter: string, sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
    this._superAdminService.getAllCourseList(filter, sortDirection, pageIndex, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(courses => {
        if (courses && courses.length > 0) {
          this.totalCount = courses[0].TotalCourseCount;
        }
        else {
          this.totalCount = 0;
        }
        this.courseSubject.next(courses);
      });

  }

  connect(): Observable<ICourseCatalog[]> {
    return this.courseSubject.asObservable();
  }

  disconnect() {
    this.courseSubject.complete();
    this.loadingSubject.complete();
  }

}
