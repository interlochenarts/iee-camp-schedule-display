import {ScheduleCourse} from './ScheduleCourse';
import {Student} from './Student';

export class BatchSchedule {
  student: Student;
  schedule: ScheduleCourse[];
  session: string;

  public static createFromJson(json: JSON): BatchSchedule {
    const batchSchedule = new BatchSchedule();
    batchSchedule.schedule = json.schedule.map(s => {
      return ScheduleCourse.createFromJson(s);
    });
    batchSchedule.student = Student.createFromJson(json.student);
    return Object.assign(batchSchedule, json);
  }
}
