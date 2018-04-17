import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routes';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { ModalPopupModule } from './shared/modules/modal-popup/modal-popup.module';
import { SelectModule } from 'ng-select';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AvailableCourseComponent } from './shared/components/availableCourse.component';
import { MandatoryCourseComponent } from './shared/components/mandatoryCourse.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb.component';
import { TotalHoursComponent } from './shared/components/totalhours.component';
import { CourseComponent } from './shared/components/course.component';
import { LoadingIndicatorComponent } from './shared/components/loadingIndicator.component';
import { RealTimeSearchComponent } from './shared/components/realTimeSearch.component';
import { SuccessComponent } from './shared/components/success/success.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { HomeComponent } from './admin/home/home.component';
import { HistoryComponent } from './admin/history/history.component';
import { HttpInterceptorService } from './shared/services/httpInterceptor.service';
import { CourseSummaryComponent } from './shared/components/course-summary/course-summary.component';
import { SummationBadgeComponent } from './shared/components/summation-badge/summation-badge.component';
import { CounterComponent } from './shared/components/counter/counter.component';
import { DndCourseSummaryComponent } from './shared/components/dnd-course-summary/dnd-course-summary.component';






import { CurriculumService } from './admin/services/curriculum.service';
import { AuthService } from './shared/services/auth.service';

import { CanActivateAdmin } from './shared/guard/admin.guard';
import { AdminResolve } from './admin//admin.resolve.service';
import { HistoryCurriculumResolver } from './admin/HistoryCurriculum.resolve.service';


import { NotificationService } from './shared/services/notification.service';




import { HourPipe } from './shared/pipes/hour.pipe';
import { AccessDeniedComponent } from './shared/error/access-denied.component';

import { SummaryComponent } from './admin/summary/summary.component';

import { CatalogComponent } from './admin/catalog/catalog.component';
import { LearnerComponent } from './learner/learner.component';
import { LearnerCurriculumService } from './learner/services/learner.service';
import { LearnerCurriculumResolver } from './learner/learnerCurriculum.resolve.service';
import { LearnerMandatoryCourseComponent } from './learner/components/mandatory-course/mandatory-course.component';
import { ElectiveCourseComponent } from './learner/components/elective-course/elective-course.component';
import { SelectedElectiveCourseComponent } from './learner/components/selected-elective-course/selected-elective-course.component';
import { EnrichmentComponent } from './learner/components/enrichment/enrichment.component';
import { CanActivateLearner } from './shared/guard/learner.guard';
import { EmployeeService } from './shared/services/employee.service';
import { LearnerTotalHoursComponent } from './learner/components/totalHours/learnerTotalhours.component';
import { LearnerBreadcrumbComponent } from './learner/components/breadcrumb/learnerBreadcrumb.component';
import { LearnerSummaryComponent } from './learner/components/summary/summary.component';
import { LearnerCourseSummaryComponent } from './learner/components/learner-course-summary/learner-course-summary.component';
import { NumberToArrayPipe } from './shared/pipes/numberToArray.pipe';
import { CurriculumComponent } from './learner/components/curriculum/curriculum.component';
import { AdminCurriculumComponent } from './admin/adminCurriculum/adminCurriculum.component';
import { ManagerComponent } from '../app/learner/components/manager/manager.component'
import { EmployeeCourseSelectionComponent } from './learner/components/employee-course-selection/employee-course-selection.component'
import { ManagerCourseSummaryComponent } from '../app/learner/components/manager-course-summary/manager-course-summary.component'
import { RSTPendingComponent } from '../app/shared/components/rst-pending/rst-pending-component'
import { AppStateService } from './shared/services/appstate.service';
import { CanActivateManager } from './shared/guard/manager.guard';
import { AdminAccessFrozenComponent } from './admin/accessFrozen/accessFrozen.component';
import { LearnerAccessFrozenComponent } from './learner/components/accessFrozen/accessFrozen.component';
import { SuperAdminService } from './super-admin/services/superAdmin.service';
import { TableComponent } from './shared/components/table/table.component';
import { CanActivateSuperAdmin } from './shared/guard/super-admin.guard';
import { FileUploaderComponent } from './shared/components/file-uploader/file-uploader.component';







@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AvailableCourseComponent,
    MandatoryCourseComponent,
    LearnerMandatoryCourseComponent,
    BreadcrumbComponent,
    TotalHoursComponent,
    CourseComponent,
    LoadingIndicatorComponent,
    RealTimeSearchComponent,
    HourPipe,
    NumberToArrayPipe,
    AccessDeniedComponent,
    SummaryComponent,
    LearnerSummaryComponent,
    SuccessComponent,
    ErrorComponent,
    HomeComponent,
    HistoryComponent,
    CourseSummaryComponent,
    SummationBadgeComponent,
    CounterComponent,
    DndCourseSummaryComponent,
    CatalogComponent,
    LearnerComponent,
    ElectiveCourseComponent,
    SelectedElectiveCourseComponent,
    EnrichmentComponent,
    LearnerTotalHoursComponent,
    LearnerBreadcrumbComponent,
    LearnerCourseSummaryComponent,
    CurriculumComponent,
    AdminCurriculumComponent,
    ManagerComponent,
    EmployeeCourseSelectionComponent,
    ManagerCourseSummaryComponent,
    RSTPendingComponent,
    AdminAccessFrozenComponent,
    LearnerAccessFrozenComponent,
    TableComponent,
    FileUploaderComponent
    
   
   

  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    ModalPopupModule,
    DragulaModule,
    SelectModule
    

  ],

  providers: [
    CurriculumService,
    LearnerCurriculumService,
    LearnerCurriculumResolver,
    NotificationService,
    HttpInterceptorService,
    AdminResolve,
    HistoryCurriculumResolver,
    AuthService,
    EmployeeService,
    AppStateService,
    CanActivateAdmin,
    CanActivateLearner,
    CanActivateManager,
    CanActivateSuperAdmin,
    SuperAdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
