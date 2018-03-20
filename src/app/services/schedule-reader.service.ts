import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ScheduleCourse} from '../classes/ScheduleCourse';

declare const Visualforce: any;

@Injectable()
export class ScheduleReaderService {
  public schedule = new BehaviorSubject<Map<string, ScheduleCourse[]>>(new Map<string, ScheduleCourse[]>());
  public educationId = new BehaviorSubject<string>(null);
  public terms = new BehaviorSubject<string[]>([]);

  constructor() {
    this.educationId.asObservable().subscribe(edId => {
      this.getSchedule(edId);
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

            this.terms.next(Object.keys(j));
            this.schedule.next(courseMap);
          }
        },
        {buffer: false, escape: false}
      );
    }
  }
}
