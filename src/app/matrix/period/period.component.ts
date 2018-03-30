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

  private dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  getStartingGridRow(): number {
    return this.periodNumber + 1;
  }

  get periodDays(): number[] {
    return Array.from(
      {length: (this.lastDay - this.firstDay + 1)},
      (v, k) => k + this.firstDay);
  }

  getDayName(day: number): string {
    return this.dayNames[day];
  }

  getPeriodGridCellStyle(): string {
    return this.getPeriodColumnGridRowStyle() + this.getPeriodGridColumnStyle(0);
  }

  getPeriodColumnGridRowStyle(): string {
    return 'grid-row: ' + this.getStartingGridRow() + ' / ' + this.getStartingGridRow() + ';';
  }

  getPeriodGridColumnStyle(index): string {
    return 'grid-column: ' + (index + 1) + ' / ' + (index + 1) + ';';
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

  courseIsFirstInRange(course: ScheduleCourse): boolean {
    const periodIndex = course.periods.indexOf(this.periodNumber);
    return periodIndex === 0 || course.periods[periodIndex - 1] !== this.periodNumber - 1;
  }

  lastPeriodInRange(course: ScheduleCourse): number {
    const index = course.periods.indexOf(this.periodNumber);
    for (let i = index; i < course.periods.length; i++) {
      if (course.periods[i + 1] && course.periods[i] + 1 !== course.periods[i + 1]) {
        return course.periods[i];
      }
    }

    return course.periods[course.periods.length - 1];
  }

  displayNone(day: number): string {
    const displaySomething: boolean = (this.periodNumber === 0) || this.courseIsFirstInRange(this.getCourseForDay(day));
    return !displaySomething ? 'display: none;' : '';
  }

  getGridRowStyle(day: number): string {
    if (this.periodNumber === 0) {
      return 'grid-row: ' + this.getStartingGridRow() + ' / ' + this.getStartingGridRow() + ';';
    } else {
      return 'grid-row: ' + this.getStartingGridRow() + ' / ' + (this.lastPeriodInRange(this.getCourseForDay(day)) + 1) + ';';
    }
  }

  getCourseGridStyle(day: number, index: number): string {
    return this.displayNone(day) + this.getGridRowStyle(day) + this.getPeriodGridColumnStyle(index + 1);
  }
}
