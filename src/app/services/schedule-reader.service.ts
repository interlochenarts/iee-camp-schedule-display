import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ScheduleCourse} from '../classes/ScheduleCourse';

declare const Visualforce: any;

@Injectable()
export class ScheduleReaderService {
  public schedule = new BehaviorSubject<ScheduleCourse[]>([]);
  public educationId = new BehaviorSubject<string>(null);

  constructor() {
    this.educationId.asObservable().subscribe(edId => {
      this.getSchedule(edId);
    });
  }

  private getSchedule(educationId: string) {
    if (educationId) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampScheduleController.getStudentSchedules',
        educationId,
        json => {
          if (json !== null) {
            const j = JSON.parse(json);
            const courses: ScheduleCourse[] = j.map(s => {
              return ScheduleCourse.createFromJson(s);
            });

            this.schedule.next(courses);
          }
        },
        {buffer: false, escape: false}
      );
    }
  }
}
