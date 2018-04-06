import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {Student} from '../_classes/Student';
import {InstituteSchedule} from '../_classes/InstituteSchedule';

declare const Visualforce: any;

@Injectable()
export class ScheduleReaderService {
  public schedule = new BehaviorSubject<Map<string, ScheduleCourse[]>>(new Map<string, ScheduleCourse[]>());
  public educationId = new BehaviorSubject<string>(null);
  public sessions = new BehaviorSubject<string[]>([]);
  public student = new BehaviorSubject<Student>(new Student());
  public instituteSchedule = new BehaviorSubject<InstituteSchedule>(new InstituteSchedule());

  constructor() {
    this.educationId.asObservable().subscribe(edId => {
      this.getSchedule(edId);
      this.getStudent(edId);
      this.getInstituteSchedule(edId);
    });
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
            this.sessions.next(Object.keys(s.majorBySessionName));
          }
        },
        {buffer: false, escape: false}
      );
    }
  }
}
