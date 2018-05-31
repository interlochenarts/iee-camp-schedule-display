import {ScheduleCourse} from './ScheduleCourse';
import {Student} from './Student';

export class BatchSchedule {
  student: Student;
  schedule: ScheduleCourse[];
  campSession: string;
  housingDivision: string;

  public static createFromJson(json: any): BatchSchedule {
    const batchSchedule = new BatchSchedule();
    Object.assign(batchSchedule, json);
    batchSchedule.schedule = json.schedule.map(s => {
      return ScheduleCourse.createFromJson(s);
    });
    batchSchedule.student = Student.createFromJson(json.student);

    return batchSchedule;
  }
}
