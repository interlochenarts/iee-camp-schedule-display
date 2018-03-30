import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ScheduleCourse} from '../_classes/ScheduleCourse';

@Component({
  selector: 'iee-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit, OnChanges {
  @Input() termSchedule: ScheduleCourse[];
  firstDay = 7;
  lastDay = -1;
  style: string;

  schedulePeriods: Array<ScheduleCourse[]> = [];

  getGridColumnStyle(): string {
    const days = this.lastDay - this.firstDay + 1;
    this.style = 'grid-template-columns: 0.75fr repeat(' + days + ', 1fr);';
    return this.style;
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
      this.schedulePeriods.length = 0;
      this.termSchedule.forEach(c => {
        // console.log('name: ' + c.courseName + ' / days: ' + c.days.join() + ' / periods: ' + c.periods.join());
        c.periods.forEach(p => {
          let courses: ScheduleCourse[] = this.schedulePeriods[p];
          if (!courses) {
            courses = [];
          }
          courses.push(c);
          this.schedulePeriods[p] = courses;
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
    }
  }
}
