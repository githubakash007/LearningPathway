import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { ModalDialogService } from '../modal-dialog.service';

@Component({
  selector: 'employee-modal-popup',
  templateUrl: './employee-modal-popup.component.html',
  styleUrls: ['./employee-modal-popup.component.css']
})
export class EmployeeModalPopupComponent implements OnInit {

  constructor(private _modalService: ModalDialogService, private _toastr: NotificationService) { }

  ngOnInit() {
  }


  

}
