import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ICurriculum } from '../../../admin/services/ICurriculum';
import { ISummationBadge } from './model/ISummationBadge';

@Component({
  selector: 'summation-badge',
  templateUrl: './summation-badge.component.html',
  styleUrls: ['./summation-badge.component.css']
})
export class SummationBadgeComponent implements OnInit, OnChanges {

  totalCourseDuration: number = 0;
  totalCourseCost: number = 0;
  @Input() isTotalCost: boolean = false;
  @Input() isTotalDuration: boolean = true;
  @Input() inputCourseList: ISummationBadge[] = [];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.isTotalCost === true) {
      this.totalCourseCost = this.calculateTotalCost(this.inputCourseList);
    }
    else if (this.isTotalDuration === true) {
      this.totalCourseDuration = this.calculateTotlaDuration(this.inputCourseList);
    }
  }

  private calculateTotalCost(inputArr: ISummationBadge[]): number {
    let totalCost: number = 0;
    if (inputArr && inputArr.length > 0) {
      totalCost = inputArr.reduce(((summation, currentItem) => summation += currentItem.BasePrice), 0);
    }

    if (totalCost > 0) {
      totalCost = Math.round(totalCost * 10) / 10;
    }
    
    return totalCost;
  }

  private calculateTotlaDuration(array: ISummationBadge[]): number {

    let totalHours: number = 0;
    if (array && array.length > 0) {
      totalHours = array.reduce(((summation, currentItem) => summation += currentItem.Duration), 0);
    }

    if (totalHours > 0) {
      totalHours = Math.round(totalHours * 10) / 10;
    }
    return totalHours;
  }

}
