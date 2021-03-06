import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ScheduleTime} from '../_classes/ScheduleTime';
import {ScheduleCourse} from '../_classes/ScheduleCourse';

@Component({
  selector: 'iee-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit, OnChanges {
  @Input() sessionSchedule: ScheduleCourse[];
  @Input() division: string;
  @Input() timesByDivision: Map<string, ScheduleTime[]>;

  scheduleByDay: Map<number, ScheduleCourse[]> = new Map<number, ScheduleCourse[]>();
  firstPeriodByDay: Map<number, number> = new Map<number, number>();

  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  get sortedDays(): number[] {
    return Array.from(this.scheduleByDay.keys()).sort();
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() { // changes: SimpleChanges) {
    // console.log(changes);

    if (this.sessionSchedule) {
      this.scheduleByDay = new Map<number, ScheduleCourse[]>();
      this.sessionSchedule.forEach((c: ScheduleCourse) => {
        Array.from(c.scheduleViewMap.keys()).forEach((day: number) => {
          let courses: ScheduleCourse[] = this.scheduleByDay.get(day);
          if (!courses) {
            courses = [];
          }

          const periods = c.scheduleViewMap.get(day).sort();
          periods.forEach(period => {
            courses[period] = c;
          });

          this.scheduleByDay.set(day, courses);
        });
      });

      this.updateFirstPeriodByDay();
    }
  }

  updateFirstPeriodByDay(): void {
    this.firstPeriodByDay = new Map<number, number>();
    // for (const entry of this.scheduleByDay.entries()) {
    Array.from(this.scheduleByDay.keys()).forEach(day => {
      const schedule = this.scheduleByDay.get(day);
      schedule.forEach((course, index) => {
        const period = this.firstPeriodByDay.get(day);
        if (!period || index < period) {
          this.firstPeriodByDay.set(day, index);
        }
      });
    });
  }
}
