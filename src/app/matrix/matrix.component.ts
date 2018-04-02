import {Component, Input, OnChanges, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ScheduleCourse} from '../_classes/ScheduleCourse';

@Component({
  selector: 'iee-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit, OnChanges {
  @Input() termSchedule: ScheduleCourse[];
  @ViewChild('matrixContainer', {read: ViewContainerRef}) matrixContainer: ViewContainerRef;
  firstDay = 7;
  lastDay = -1;
  style: string;

  periodNumbers: number[] = [];

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  getGridColumnStyle(): string {
    const days = this.lastDay - this.firstDay + 1;
    this.style = 'grid-template-columns: 0.75fr repeat(' + days + ', 1fr);';
    return this.style;
  }

  get periodDays(): number[] {
    return Array.from(
      {length: (this.lastDay - this.firstDay + 1)},
      (v, k) => k + this.firstDay);
  }

  getHeaderGridColumnStyle(index: number): string {
    return 'grid-column: ' + (index + 2) + ' / ' + (index + 2) + ';';
  }

  getPeriodColumnGridRowStyle(period: number): string {
    return 'grid-row: ' + (period + 1) + ' / ' + (period + 1) + ';';
  }

  getPeriodGridCellStyle(period: number): string {
    return this.getPeriodColumnGridRowStyle(period) + this.getPeriodGridColumnStyle(0);
  }

  getPeriodGridColumnStyle(index): string {
    return 'grid-column: ' + (index + 1) + ' / ' + (index + 1) + ';';
  }

  constructor() {
  }

  ngOnInit() {
    this.updateSchedule();
  }

  ngOnChanges() {
    this.updateSchedule();
  }

  updateSchedule(): void {
    if (this.termSchedule) {
      this.termSchedule.forEach(c => {
        // console.log('name: ' + c.courseName + ' / days: ' + c.days.join() + ' / periods: ' + c.periods.join());
        c.periods.forEach(p => {
          if (this.periodNumbers.indexOf(p) < 0) {
            this.periodNumbers.push(p);
          }
        });

        c.days.forEach(d => {
          if (d < this.firstDay) {
            this.firstDay = d;
          }
          if (d > this.lastDay) {
            this.lastDay = d;
          }
        });
      });

      this.periodNumbers.sort();

      this.createDivsForCourse(c);
    }
  }

  createDivsForCourse(course: ScheduleCourse) {
    course.periods.forEach(p => {
      if (this.courseIsFirstInRange(course, p)) {
        // insert div
        
      }
    });
  }

  lastPeriodInRange(course: ScheduleCourse, period: number): number {
    const index = course.periods.indexOf(period);
    for (let i = index; i < course.periods.length; i++) {
      if (course.periods[i + 1] && course.periods[i] + 1 !== course.periods[i + 1]) {
        return course.periods[i];
      }
    }

    return course.periods[course.periods.length - 1];
  }

  courseIsFirstInRange(course: ScheduleCourse, period: number): boolean {
    const periodIndex = course.periods.indexOf(period);
    return periodIndex === 0 || course.periods[periodIndex - 1] !== period - 1;
  }
}
