import {Component, Input, OnInit} from '@angular/core';
import {ScheduleCourse} from '../../classes/ScheduleCourse';

@Component({
  selector: 'iee-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent implements OnInit {
  @Input() periodCourses: ScheduleCourse[];
  @Input() periodNumber: number;
  @Input() firstDay: number;
  @Input() lastDay: number;

  get periodDays(): number[] {
    return Array.from(
      {length: (this.lastDay - this.firstDay + 1)},
      (v, k) => k + this.firstDay);
  }

  constructor() {
  }

  ngOnInit() {
  }

  getCourseForDay(day: number): ScheduleCourse {
    for (i = 0; i <= this.periodCourses.length; i++) {
      if (this.periodCourses[i].days.indexOf(day) >= 0) {
        return this.periodCourses[i];
      }
    }

    return null;
  }
}
