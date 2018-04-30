import {Component, Input, OnInit} from '@angular/core';
import {ScheduleTime} from '../_classes/ScheduleTime';
import {ScheduleCourse} from '../_classes/ScheduleCourse';

@Component({
  selector: 'iee-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  @Input() sessionSchedule: ScheduleCourse[];
  @Input() division: string;
  @Input() timesByDivision: Map<string, ScheduleTime[]>;

  scheduleByDay: Map<number, ScheduleCourse[]> = new Map<number, ScheduleCourse[]>();

  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  get sortedDays(): number[] {
    return Array.from(this.scheduleByDay.keys()).sort();
  }

  constructor() {
  }

  ngOnInit() {
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
  }

}
