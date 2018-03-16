import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Student} from '../classes/Student';
import {ScheduleCourse} from '../classes/ScheduleCourse';

@Component({
  selector: 'iee-screen-display',
  templateUrl: './screen-display.component.html',
  styleUrls: ['./screen-display.component.css']
})
export class ScreenDisplayComponent implements OnInit {
  educationId: string;
  scheduleCourseStrings = [
    '{"courseName": "Artchery", "instructor": "Shooter McGavin", "location": "Lake", "schedulePeriods": "5", "scheduleDays":"1,2,3,4,5,6"}',
    '{"courseName": "Intro to Microphones", "instructor": "Mike Patton", "location": "Drainage Ditch", "schedulePeriods": "1,2,6,7", "scheduleDays":"1,3,5"}',
    '{"courseName": "Cantankery", "instructor": "Ed Asner", "location": "Who Cares?", "schedulePeriods": "1,2,6,7", "scheduleDays":"2,4"}',
    '{"courseName": "Villainy", "instructor": "Snidely Whiplash", "location": "Railroad Tracks", "schedulePeriods": "3,4", "scheduleDays":"1,2,3,4,5,6"}',
    '{"courseName": "Building Bridges", "instructor": "Jeff Bridges", "location": "River", "schedulePeriods": "8", "scheduleDays":"1,2,3,4,5,6"}',
    '{"courseName": "Use Your Imagination","instructor": "Fred Rogers","location":"Neighborhood of Make-Believe", "schedulePeriods": "9", "scheduleDays":"1,2,3,4,5,6"}'
  ];
  scheduleCourses: ScheduleCourse[] = [];
  student: Student = new Student();

  constructor(private activatedRoute: ActivatedRoute) {
    this.scheduleCourses = this.scheduleCourseStrings.map(sc => {
      return ScheduleCourse.createFromJson(JSON.parse(sc));
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((p: Params) => {
      this.educationId = p['educationId'];
      console.log(p['educationId']);
    });
  }

}
