import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../services/appstate.service';
import { learnerDemoVideo } from '../../constants/app.constant';

@Component({
  selector: 'rst-pending',
  templateUrl: './rst-pending-component.html',
  styleUrls: ['./rst-pending-component.css']
})
export class RSTPendingComponent implements OnInit {

  constructor(private _appState: AppStateService) {
    this._appState.videoSource.next(learnerDemoVideo);
   }

  ngOnInit() {
  }

}
