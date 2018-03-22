import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Student} from '../classes/Student';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleCourse} from '../classes/ScheduleCourse';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'iee-screen-display',
  templateUrl: './screen-display.component.html',
  styleUrls: ['./screen-display.component.css']
})
export class ScreenDisplayComponent implements OnInit {
  student: Student = new Student();
  activeTermIndex = 0;
  schedules: Map<string, ScheduleCourse[]> = new Map<string, ScheduleCourse[]>();
  activeSchedule: ScheduleCourse[] = [];
  terms: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));
      this.activeTermIndex = +p.get('termIndex');

      const scheduleObs = this.scheduleReader.schedule.asObservable();
      const termsObs = this.scheduleReader.terms.asObservable();

      Observable.combineLatest(scheduleObs, termsObs).subscribe(obs => {
        [this.schedules, this.terms] = obs;
        this.activeSchedule = this.schedules.get(this.terms[this.activeTermIndex]);
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });
    });
  }
}
