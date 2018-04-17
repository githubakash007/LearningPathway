import { Component, OnInit, Input } from '@angular/core';
import { CurriculumService } from '../../../admin/services/curriculum.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
     
  currentSelectedAdminRole:string='';
   @Input() roleName:string =  "Process Engineer";
  constructor(private _service: CurriculumService) {
    this.currentSelectedAdminRole =  this._service.CurrentAdminRole;
   }

  ngOnInit() {
    
  }

}
