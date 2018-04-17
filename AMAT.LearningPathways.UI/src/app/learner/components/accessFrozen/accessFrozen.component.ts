import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/services/appstate.service';
import { learnerDemoVideo } from '.././../../shared/constants/app.constant';

@Component({
  selector: 'learner-access-frozen',
  templateUrl: './accessFrozen.component.html',
  styleUrls: ['./accessFrozen.component.css']
})
export class LearnerAccessFrozenComponent implements OnInit {

  constructor(private _appState: AppStateService) {
    this._appState.videoSource.next(learnerDemoVideo);
  }

  ngOnInit() {
  }

}
