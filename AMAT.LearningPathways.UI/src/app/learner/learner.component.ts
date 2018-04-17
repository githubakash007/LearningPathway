import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, Event, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/pairwise';
import { LearnerCurriculumService } from './services/learner.service';
declare let $:any;

@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.css']
})
export class LearnerComponent implements OnInit {

  constructor(private _router: Router, private _learnerService: LearnerCurriculumService) {
    _router.events.filter(event => event instanceof NavigationEnd).pairwise()
      .subscribe((e) => {
        _learnerService.prevUrl = (<NavigationEnd>e[0]).urlAfterRedirects;
        _learnerService.currentUrl = (<NavigationEnd>e[1]).urlAfterRedirects;
        window.scrollTo(0, 0);
      });

      (<any>$("body").tooltip({
        selector: '[data-toggle="tooltip"]'
    }));

  }

  ngOnInit() { }

}
