import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'generic-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  
  @Input() errorObj = undefined;
  //errorObj:any = { "status": "400", "errorMessage": "Bad Request" };
  constructor(private _route:ActivatedRoute) {
   //this.errorObj = this._route.snapshot.data;
   }

  ngOnInit() {
  }

}
