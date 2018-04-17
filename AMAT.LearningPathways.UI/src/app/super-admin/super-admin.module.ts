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
    EmployeeDialogComponent
  ],
  entryComponents:[
    EmployeeDetailsComponent
  ],
  providers:[
    
  ]
})
export class SuperAdminModule { }
