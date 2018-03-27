import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Student} from '../_classes/Student';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {InstituteSchedule} from '../_classes/InstituteSchedule';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'iee-screen-display',
  templateUrl: './screen-display.component.html',
  styleUrls: ['./screen-display.component.css']
})
export class ScreenDisplayComponent implements OnInit {
  student: Student = new Student();
  educationId = '';
  schedules: Map<string, ScheduleCourse[]> = new Map<string, ScheduleCourse[]>();
  activeTermIndex = 0;
  activeTerm = '';
  activeSchedule: ScheduleCourse[] = [];
  instituteSchedule: InstituteSchedule = null;
  terms: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));
      this.educationId = p.get('educationId');
      this.activeTermIndex = +p.get('termIndex');

      const scheduleObs = this.scheduleReader.schedule.asObservable();
      const termsObs = this.scheduleReader.terms.asObservable();
      const instituteObs = this.scheduleReader.instituteSchedule.asObservable();

      Observable.combineLatest(scheduleObs, termsObs, instituteObs).subscribe(obs => {
        [this.schedules, this.terms, this.instituteSchedule] = obs;
        this.activeTerm = this.terms[this.activeTermIndex];
        this.activeSchedule = this.schedules.get(this.activeTerm);
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });
    });
  }
}
