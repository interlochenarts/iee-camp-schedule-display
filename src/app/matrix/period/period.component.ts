import {Component, Input, OnInit} from '@angular/core';
import {ScheduleCourse} from '../../_classes/ScheduleCourse';

@Component({
  selector: 'iee-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css'],
  preserveWhitespaces: false
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
    if (this.periodCourses) {
      for (let i = 0; i < this.periodCourses.length; i++) {
        if (this.periodCourses[i].days.indexOf(day) >= 0) {
          return this.periodCourses[i];
        }
      }
    }

    const course = new ScheduleCourse('Free Period');
    course.schedulePeriods = String(this.periodNumber);
    return course;
  }

  printBottomBorder(course: ScheduleCourse): boolean {
    const index = course.periods.indexOf(this.periodNumber);
    return index === (course.periods.length - 1) || course.periods[index + 1] !== this.periodNumber + 1;
  }

  printRightBorder(dayNumber: number): boolean {
    return dayNumber === this.lastDay;
  }

  // did we already print the info about this course immediately above it?
  displayCourseInfo(course: ScheduleCourse): boolean {
    const index = course.periods.indexOf(this.periodNumber);
    return index === 0 || course.periods[index - 1] !== this.periodNumber - 1;
  }
}
