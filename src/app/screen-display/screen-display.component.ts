import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Student} from '../classes/Student';
import {ScheduleCourse} from '../classes/ScheduleCourse';
import {ScheduleReaderService} from '../services/schedule-reader.service';

@Component({
  selector: 'iee-screen-display',
  templateUrl: './screen-display.component.html',
  styleUrls: ['./screen-display.component.css']
})
export class ScreenDisplayComponent implements OnInit {
  student: Student = new Student();

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));
    });
  }
}
