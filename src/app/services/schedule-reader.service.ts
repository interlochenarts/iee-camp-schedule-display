import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {Student} from '../_classes/Student';
import {InstituteSchedule} from '../_classes/InstituteSchedule';
import {ScheduleTime} from '../_classes/ScheduleTime';

declare const Visualforce: any;

@Injectable()
export class ScheduleReaderService {
  public schedule = new BehaviorSubject<Map<string, ScheduleCourse[]>>(new Map<string, ScheduleCourse[]>());
  public educationId = new BehaviorSubject<string>(null);
  public sessions = new BehaviorSubject<string[]>([]);
  public student = new BehaviorSubject<Student>(new Student());
  public instituteSchedule = new BehaviorSubject<InstituteSchedule>(null);
  public timesByDivision = new BehaviorSubject<Map<string, ScheduleTime[]>>(new Map<string, ScheduleTime[]>());

  constructor() {
    this.educationId.asObservable().subscribe(edId => {
      this.getSchedule(edId);
      this.getStudent(edId);
      this.getInstituteSchedule(edId);
    });

    this.getScheduleTimes();
  }

  private getSchedule(educationId: string) {
    if (educationId) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleController.getStudentSchedulesByEducation',
        educationId,
        json => {
          if (json !== null) {
            const courseMap = new Map<string, ScheduleCourse[]>();
            const j = JSON.parse(json);
            Object.keys(j).forEach(k => {
              const courses: ScheduleCourse[] = j[k].map(s => {
                return ScheduleCourse.createFromJson(s);
              });
              courseMap.set(k, courses);
            });

            this.schedule.next(courseMap);
            this.sessions.next(Array.from(courseMap.keys()).sort());
          }
        },
        {buffer: false, escape: false}
      );
    }
  }

  private getInstituteSchedule(educationId: string) {
    if (educationId) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleController.getInstituteScheduleByEducation',
        educationId,
        json => {
          if (json !== null) {
            const j = JSON.parse(json);
            this.instituteSchedule.next(InstituteSchedule.createFromJson(j));
          }
        },
        {buffer: false, escape: false}
      );
    }
  }

  private getStudent(educationId: string) {
    if (educationId) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleController.getStudentInformationByEducation',
        educationId,
        json => {
          if (json !== null) {
            const j = JSON.parse(json);
            const s: Student = Student.createFromJson(j);
            this.student.next(s);
          }
        },
        {buffer: false, escape: false}
      );
    }
  }

  private getScheduleTimes() {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampScheduleController.getScheduleTimes',
      json => {
        if (json) {
          const j = JSON.parse(json);
          const timeByDiv: Map<string, ScheduleTime[]> = new Map<string, ScheduleTime[]>();
          Object.keys(j).forEach(division => {
            const timesJson: any[] = j[division];
            const times = timesJson.map(t => {
              const st: ScheduleTime = new ScheduleTime();
              return Object.assign(st, t);
            });
            timeByDiv.set(division, times);
          });

          this.timesByDivision.next(timeByDiv);
        }
      },
      {buffer: false, escape: false}
    );
  }

  public getCabins(termId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleBatchController.getCampCabins',
        termId,
        json => {
          if (json) {
            resolve(JSON.parse(json));
          } else {
            reject(new Error('Failed to get cabins'));
          }
        },
        {buffer: false, escape: false}
      );
    });
  }

  public getCampTerms(): Promise<Map<string, string>> {
    return new Promise((resolve, reject) => {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleBatchController.getCampTerms',
        json => {
          if (json) {
            const j = JSON.parse(json);
            const m: Map<string, string> = new Map<string, string>();
            for (const k of Object.keys(j)) {
              m.set(k, j[k]);
            }
            resolve(m);
          } else {
            reject(new Error('Failed to get terms'));
          }
        },
        {buffer: false, escape: false}
      );
    });
  }

  public getArrivalWeeksForTerm(term: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleBatchController.getArrivalWeekDatesForTerm',
        term,
        json => {
          if (json) {
            resolve(JSON.parse(json));
          } else {
            reject(new Error('Failed to get arrival weeks'));
          }
        },
        {buffer: false, escape: false}
      );
    });
  }
}
