export class ScheduleCourse {
  public courseName: string;
  public instructor: string;
  public location: string;
  public schedulePeriods: string;
  public scheduleDays: string;

  public static createFromJson(json: JSON): ScheduleCourse {
    const scheduleCourse = new ScheduleCourse(null);
    return Object.assign(scheduleCourse, json);
  }

  constructor(courseName: string) {
    if (courseName) {
      this.courseName = courseName;
    }
  }

  get days(): number[] {
    return this.scheduleDays.split(',').map(value => {
      return +value;
    });
  }

  get periods(): number[] {
    return this.schedulePeriods.split(',').map(value => {
      return +value;
    });
  }
}
