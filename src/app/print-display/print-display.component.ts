import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {Student} from '../_classes/Student';
import {Observable} from 'rxjs/Observable';
import {InstituteSchedule} from '../_classes/InstituteSchedule';
import {ScheduleTime} from '../_classes/ScheduleTime';

@Component({
  selector: 'iee-print-display',
  templateUrl: './print-display.component.html',
  styleUrls: ['./print-display.component.css']
})
export class PrintDisplayComponent implements OnInit {
  student: Student = new Student();
  schedulesBySession: Map<string, ScheduleCourse[]> = new Map<string, ScheduleCourse[]>();
  instituteSchedule: InstituteSchedule = null;
  sessions: string[] = [];
  timesByDivision = new Map<string, ScheduleTime[]>();


  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));
      const scheduleObs = this.scheduleReader.schedule.asObservable();
      const sessionsObs = this.scheduleReader.sessions.asObservable();
      const instituteObs = this.scheduleReader.instituteSchedule.asObservable();

      Observable.combineLatest(scheduleObs, sessionsObs, instituteObs).subscribe(obs => {
        [this.schedulesBySession, this.sessions, this.instituteSchedule] = obs;
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });

      // load the map of schedule times based on the possible student divisions
      this.scheduleReader.timesByDivision.asObservable().subscribe(value => {
        this.timesByDivision = value;
      });
    });
  }

  getScheduleBySessionName(sessionName: string): ScheduleCourse[] {
    if (this.schedulesBySession) {
      return this.schedulesBySession.get(sessionName);
    }

    return [];
  }

  onPrint(): void {
    window.print();
  }
}
