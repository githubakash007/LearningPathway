import { Component, OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'msg-model-popup',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit,OnChanges {

  @Input() inputModalPopupSizeClass?:string = '';
  @Input() modalPopupSizeClass?:string = '';
  visible = false;
  visibleAnimate = false;
  
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(change:SimpleChanges):void{
    this.modalPopupSizeClass =  this.inputModalPopupSizeClass;

  }

  public show(e:any): void {
    if(e !== undefined){
      e.preventDefault();
    }
    
    this.visible = true;
    let isClassExist = document.body.classList.contains('modal-open');
    if (!isClassExist)
      document.body.className += ' modal-open';
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(e:any): void {
    if(e !== undefined){
      e.preventDefault();
    }
    this.visibleAnimate = false;
    document.body.className = document.body.className.replace('modal-open', '');
    setTimeout(() => this.visible = false, 300);
  }

  
  private processError(error: Response): void {
    
   //Will see
  }

}
