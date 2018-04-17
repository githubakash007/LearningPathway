import { Component } from '@angular/core';
declare let $:any;


@Component({
  selector: "app-admin",
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor() {
    (<any>$("body").tooltip({
      selector: '[data-toggle="tooltip"]'
  }));
  }
}
