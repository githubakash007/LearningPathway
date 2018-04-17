import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from './modal-dialog.component';
import { ModalDialogService } from './modal-dialog.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ModelComponent } from './model/model.component';
import { EmployeeModalPopupComponent } from './employee-modal-popup/employee-modal-popup.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalDialogComponent, ErrorDialogComponent, ModelComponent, EmployeeModalPopupComponent],
  providers:[ModalDialogService],
  exports:[ModalDialogComponent,ModelComponent]
})
export class ModalPopupModule {

 }
