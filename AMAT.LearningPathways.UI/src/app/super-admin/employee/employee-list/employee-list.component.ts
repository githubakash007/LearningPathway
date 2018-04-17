import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IEmployee } from '../model/IEmployee.modal';
import { MatPaginator, MatTableDataSource, MatSort, MatSortable, PageEvent, MatDialog, MatDialogRef } from '@angular/material';
import { SuperAdminService } from '../../services/superAdmin.service';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize } from 'rxjs/operators';
import { merge } from "rxjs/observable/merge";
import { fromEvent } from 'rxjs/observable/fromEvent';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employeeDataSource: EmployeeDataSource;
  displayedColumn = ['employeeId', 'employeeName', 'workEmail','isPathwayBlocked','hasLearnerFrozen', 'buttons'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private route: ActivatedRoute, private _superAdminService: SuperAdminService, private _matDialog: MatDialog) {

  }

  openEmployeeDetail(emp: IEmployee) {
    let dialogRef = this._matDialog.open(EmployeeDetailsComponent, {
      width: '60%',
      height:'auto',
      data: emp
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const foundIndex = this.employeeDataSource.employeeSubject.value.findIndex(x => x.EmployeeID === result.EmployeeID);
        this.employeeDataSource.employeeSubject.value[foundIndex] = result;
        this.employeeDataSource.employeeSubject.next(this.employeeDataSource.employeeSubject.value);
      }
    });

  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;

        this.loadEmployeePage();
      })
      )
      .subscribe();


    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
      tap(() => this.loadEmployeePage())
      )
      .subscribe();

  }

  loadEmployeePage() {
    this.employeeDataSource.loadEmployee(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  ngOnInit() {
    this.employeeDataSource = new EmployeeDataSource(this._superAdminService);
    this.employeeDataSource.loadEmployee('', 'asc', 0, 10);
  }

  getEmployeeList(): Observable<IEmployee[]> {
    return this._superAdminService.getEmployeeList();
  }

}


export class EmployeeDataSource extends DataSource<IEmployee>{

  public employeeSubject = new BehaviorSubject<IEmployee[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading = this.loadingSubject.asObservable();
  public totalCount: number = 0;

  constructor(private _superAdminService: SuperAdminService) {
    super();
  }

  loadEmployee(filter: string, sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
    this._superAdminService.getAlltEmployeeList(filter, sortDirection, pageIndex, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(employees => {
        if (employees && employees.length > 0) {
          this.totalCount = employees[0].TotalEmployeeCount;
        }
        else {
          this.totalCount = 0;
        }
        this.employeeSubject.next(employees);
      });

  }
  connect(): Observable<IEmployee[]> {
    return this.employeeSubject.asObservable();
  }

  disconnect() {
    this.employeeSubject.complete();
    this.loadingSubject.complete();
  }

}
