import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule,MatSortModule,MatPaginatorModule,MatFormFieldModule,MatInputModule,
  MatDialogModule,MatProgressSpinnerModule,MatSelectModule} from '@angular/material';

  import {MatRadioModule} from '@angular/material';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeDialogComponent } from './employee/employee-dialog/employee-dialog.component';

import {CourseAddComponent} from '../super-admin/coursecatalog/course-add/course-add.component'

import {CourseEditComponent} from '../super-admin/coursecatalog/course-edit/course-edit.component'
import {CourseListComponent} from '../super-admin/coursecatalog/course-list/course-list.component'

//import {TestDetailsComponent} from '../super-admin/test.component';

@NgModule({
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,  
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule         
   ],
  declarations: [
    EmployeeListComponent, 
    EmployeeDetailsComponent,
    EmployeeDialogComponent,
    CourseAddComponent,
    CourseEditComponent,
    CourseListComponent,
    //TestDetailsComponent

  ],
  entryComponents:[
    EmployeeDetailsComponent,
    CourseEditComponent,
    CourseAddComponent
  ],
  providers:[
    
  ]
})
export class SuperAdminModule { }
