import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AppStateService  {
  
  private learnerPathwaySubmittedSource:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public learnerPathwaySubmittedObservable = this.learnerPathwaySubmittedSource.asObservable();
    
  
  public videoSource:BehaviorSubject<string> = new BehaviorSubject<string>('');
  public videoObservable = this.videoSource.asObservable();

  public IsPathwaySubmitted(flag:boolean){
    this.learnerPathwaySubmittedSource.next(flag);
  }  
  
}
