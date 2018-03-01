import {Component, OnInit} from '@angular/core';
import {ScheduleCourse} from '../classes/ScheduleCourse';

@Component({
  selector: 'iee-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {
  scheduleCourses: ScheduleCourse[] = [];
  scheduleCourseStrings = [
    '{"courseName": "Artchery", "instructor": "Shooter McGavin", "location": "Lake", "schedule": "5(Mon-Sat)"}',
    '{"courseName": "Intro to Microphones", "instructor": "Mike Patton", "location": "Drainage Ditch", "schedule": "1-2,6-7(Mon,Wed,Fri)"}',
    '{"courseName": "Cantankery", "instructor": "Ed Asner", "location": "Who Cares?", "schedule": "1-2,6-7(Tue,Thu)"}',
    '{"courseName": "Villainy", "instructor": "Snidely Whiplash", "location": "Railroad Tracks", "schedule": "3-4(Mon-Sat)"}',
    '{"courseName": "Building Bridges", "instructor": "Jeff Bridges", "location": "River", "schedule": "8(Mon-Sat)"}',
    '{"courseName": "Use Yer Imagination", "instructor": "Fred Rogers","location":"Neighborhood of Make-Believe", "schedule": "9(Mon-Sat)"}'
  ];
  firstDay = 7;
  lastDay = -1;

  schedulePeriods: Array<ScheduleCourse[]> = [[]];

  constructor() {
  }

  ngOnInit() {
    this.scheduleCourses = this.scheduleCourseStrings.map((sc) => {
      return ScheduleCourse.createFromJson(JSON.parse(sc));
    });

    this.scheduleCourses.forEach(c => {
      console.log('name: ' + c.courseName + ' / days: ' + c.days.join() + ' / periods: ' + c.periods.join());
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
