import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

    exclusionListUrl:string='';
  constructor() { 
    this.exclusionListUrl = sessionStorage.getItem("exclusionlist");

  }

  ngOnInit() {
  }

}
