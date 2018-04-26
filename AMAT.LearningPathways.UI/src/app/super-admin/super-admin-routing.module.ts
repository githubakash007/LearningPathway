import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { CourseListComponent } from '../super-admin/coursecatalog/course-list/course-list.component'

const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeListComponent
  },
  {
    path: 'course',
    component:CourseListComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
