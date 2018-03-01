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
    '{courseName: "Artchery", instructor: "Shooter McGavin", location: "Lake", schedule: "5(Mon-Sat)"}',
    '{courseName: "Intro to Microphones", instructor: "Mike Patton", location: "Drainage Ditch", schedule: "1-2,6-7(Mon,Wed,Fri)"}',
    '{courseName: "Cantankery", instructor: "Ed Asner", location: "Who Cares?", schedule: "1-2,6-7(Tue,Thu)"}',
    '{courseName: "Villainy", instructor: "Snidely Whiplash", location: "Railroad Tracks", schedule: "3-4(Mon-Sat)"}',
    '{courseName: "Building Bridges", instructor: "Jeff Bridges", location: "River", schedule: "8(Mon-Sat)"}',
    '{courseName: "Use Yer Imagination", instructor: "Fred Rogers", location: "Neighborhood of Make-Believe", schedule: "9(Mon-Sat)"}'
  ];

  constructor() {
  }

  ngOnInit() {
    this.scheduleCourses = this.scheduleCourseStrings.map((sc) => {
      return ScheduleCourse.createFromJson(JSON.parse(sc));
    });

    console.log(this.scheduleCourses);
  }

}
