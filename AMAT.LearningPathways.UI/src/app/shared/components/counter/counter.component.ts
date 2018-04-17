import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hour-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {

  @Input() initialRequiredHours: number;
  @Input() requiredHourText: string = '';
  @Output() hourChange: EventEmitter<number> = new EventEmitter<number>(); 
  constructor() { }

  ngOnInit() {
  }

  increase(): void {
    this.initialRequiredHours = this.initialRequiredHours + 1;
    this.hourChange.emit(this.initialRequiredHours);
  }

  decrease(): void {
    if (this.initialRequiredHours > 0) {
      this.initialRequiredHours = this.initialRequiredHours - 1;
      this.hourChange.emit(this.initialRequiredHours);
    }
  }

}
