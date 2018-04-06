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
  schedulesBySession: Map<string, ScheduleCourse[]> = new Map<string, ScheduleCourse[]>();
  activeSessionIndex = 0;
  activeSession = '';
  activeSchedule: ScheduleCourse[] = [];
  instituteSchedule: InstituteSchedule = null;
  sessions: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));
      this.educationId = p.get('educationId');
      this.activeSessionIndex = +p.get('sessionIndex');

      const scheduleObs = this.scheduleReader.schedule.asObservable();
      const sessionsObs = this.scheduleReader.sessions.asObservable();
      const instituteObs = this.scheduleReader.instituteSchedule.asObservable();

      Observable.combineLatest(scheduleObs, sessionsObs, instituteObs).subscribe(obs => {
        [this.schedulesBySession, this.sessions, this.instituteSchedule] = obs;
        this.activeSession = this.sessions[this.activeSessionIndex];
        this.activeSchedule = this.schedulesBySession.get(this.activeSession);
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });
    });
  }
}
