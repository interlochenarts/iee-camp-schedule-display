import {ScheduleCourse} from './ScheduleCourse';
import {Student} from './Student';

export class BatchSchedule {
  student: Student;
  schedule: ScheduleCourse[];
  session: string;

  public static createFromJson(json: JSON): BatchSchedule {
    const schedule = new BatchSchedule();
    return Object.assign(schedule, json);
  }
}
