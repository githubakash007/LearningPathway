import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../shared/services/appstate.service';
import { adminDemoVideo } from '../../shared/constants/app.constant';

@Component({
  selector: 'access-frozen',
  templateUrl: './accessFrozen.component.html',
  styleUrls: ['./accessFrozen.component.css']
})
export class AdminAccessFrozenComponent implements OnInit {

  constructor(private _appState: AppStateService) {
    this._appState.videoSource.next(adminDemoVideo);
  }

  ngOnInit() {
  }

}
