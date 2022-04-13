import {Component, OnInit, HostListener} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Student} from '../_classes/Student';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {combineLatest} from 'rxjs';
import {InstituteSchedule} from '../_classes/InstituteSchedule';
import {ScheduleTime} from '../_classes/ScheduleTime';

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
  timesByDivision = new Map<string, ScheduleTime[]>();
  innerWidth: number;
  weekNamesBySession = new Map<string, string>();

  public get isMobile(): boolean {
    return this.innerWidth < 1200;
  }

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService) {
  }

  // detect changes to the client window size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    // set the client width based on window width
    this.innerWidth = window.innerWidth;

    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));
      this.educationId = p.get('educationId');
      this.activeSessionIndex = +p.get('sessionIndex');

      const scheduleObs = this.scheduleReader.schedule.asObservable();
      const sessionsObs = this.scheduleReader.sessions.asObservable();
      const instituteObs = this.scheduleReader.instituteSchedule.asObservable();

      combineLatest([scheduleObs, sessionsObs, instituteObs]).subscribe(obs => {
        [this.schedulesBySession, this.sessions, this.instituteSchedule] = obs;
        this.activeSession = this.sessions[this.activeSessionIndex];
        this.activeSchedule = this.schedulesBySession.get(this.activeSession);

        // Build week names based on if they have an institute/intensive
        if (this.instituteSchedule && this.instituteSchedule.pdfLink) {
          this.weekNamesBySession.set('1 week', 'Intensive');
        } else {
          this.weekNamesBySession.set('1 week', 'Week 0');
        }
        // Default values for the rest
        this.weekNamesBySession.set('1st 3 weeks', 'Weeks 1-3');
        this.weekNamesBySession.set('1st 2 weeks', 'Weeks 1 & 2');
        this.weekNamesBySession.set('2nd 3 weeks', 'Weeks 4-6');
        this.weekNamesBySession.set('2nd 4 weeks', 'Weeks 1-4');
        this.weekNamesBySession.set('2nd 2 weeks', 'Weeks 3 & 4');
        this.weekNamesBySession.set('6 weeks', 'Weeks 1-6');
        this.weekNamesBySession.set('3rd 4 weeks', 'Weeks 3-6');
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });
    });

    // load the map of schedule times based on the possible student divisions
    this.scheduleReader.timesByDivision.asObservable().subscribe(value => {
      this.timesByDivision = value;
    });
  }

  displayPrintView(): boolean {
    return !(this.sessions && this.sessions.length === 1 && this.sessions[0] === '1 week');
  }
}
