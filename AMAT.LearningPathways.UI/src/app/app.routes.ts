import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SummaryComponent } from './admin/summary/summary.component';
import { ICurriculum } from './admin/services/ICurriculum';
import { AdminResolve } from './admin/admin.resolve.service';
import { HistoryCurriculumResolver } from './admin/HistoryCurriculum.resolve.service';
import { AccessDeniedComponent } from './shared/error/access-denied.component';
import { CanActivateAdmin } from './shared/guard/admin.guard';
import { SuccessComponent } from './shared/components/success/success.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { HomeComponent } from './admin/home/home.component';
import { LearnerComponent } from './learner/learner.component';
import { LearnerCurriculumResolver } from './learner/learnerCurriculum.resolve.service';
import { CanActivateLearner } from './shared/guard/learner.guard';
import { LearnerSummaryComponent } from './learner/components/summary/summary.component';
import { CurriculumComponent } from './learner/components/curriculum/curriculum.component';
import { AdminCurriculumComponent } from './admin/adminCurriculum/adminCurriculum.component';
import { ManagerComponent } from "../app/learner/components/manager/manager.component"
import { RSTPendingComponent } from './shared/components/rst-pending/rst-pending-component';

import { FileUploaderComponent } from '../app/shared/components/file-uploader/file-uploader.component'

import { CanActivateManager } from './shared/guard/manager.guard';
import { AdminAccessFrozenComponent } from './admin/accessFrozen/accessFrozen.component';
import { LearnerAccessFrozenComponent } from './learner/components/accessFrozen/accessFrozen.component';
import { CanActivateSuperAdmin } from './shared/guard/super-admin.guard';

export const AppRoutes: Routes = [

    {

        path: 'superadmin',
        loadChildren: 'app/super-admin/super-admin.module#SuperAdminModule',
        canActivate: [CanActivateSuperAdmin]
    },

    {
        path: '',
        redirectTo: 'learner',
        pathMatch: 'full'
    },
    {
        path: "learner",
        component: LearnerComponent,
        canActivate: [CanActivateLearner],
       
        children: [{
            path: '',
            redirectTo: 'curriculum',
            pathMatch: 'full',
        },
        {
            path: 'curriculum',
            component: CurriculumComponent,
            resolve: { learnerCurriculumResolver: LearnerCurriculumResolver },
            data: { title: "learnerCurriculum" }
        },
        {
            path: 'summary',
            component: LearnerSummaryComponent,
            resolve: { learnerCurriculumResolver: LearnerCurriculumResolver },
            data: { title: "learnerSummary" }
        },
        {
            path: 'file',
            component: FileUploaderComponent,
            data: { title: "learnerSummary" }
        }
            // {
            //     path: 'manager',
            //     component: ManagerComponent
            //     //,
            //     //data: { title: "learnerCurriculum" }
            // }
        ]
    },

    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [CanActivateAdmin],
        children: [{
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'

        },
        {
            path: 'home',
            component: HomeComponent
        }
            ,
        {
            path: 'roles/:id',
            resolve: { historyCurriculumList: HistoryCurriculumResolver },
            children: [{
                path: '',
                redirectTo: 'curriculum',
                pathMatch: 'full'

            },
            {
                path: 'curriculum',
                component: AdminCurriculumComponent
            },
            {
                path: 'summary',
                component: SummaryComponent
            },
            {
                path: 'success',
                component: SuccessComponent
            }
            ]

        }
        ]

    },

    {
        path: 'manager',
        canActivate: [CanActivateManager],
        component: ManagerComponent
    },


    // { path: 'success', component: SuccessComponent },
    { path: 'error', component: ErrorComponent },
    { path: "access-frozen", component: AdminAccessFrozenComponent },
    { path: "learner-access-frozen", component: LearnerAccessFrozenComponent },
    { path: "access-denied", component: AccessDeniedComponent },
    { path: "rst-pending", component: RSTPendingComponent },
    { path: '', redirectTo: '/learner', pathMatch: 'full' },
    { path: '**', redirectTo: '/learner', pathMatch: 'full' },


]