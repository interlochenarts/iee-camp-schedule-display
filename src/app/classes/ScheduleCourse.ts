export class ScheduleCourse {
  public courseName: string;
  public instructor: string;
  public location: string;
  private schedulePeriods: string;
  private scheduleDays: string;

  private dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  public static createFromJson(json: any): ScheduleCourse {
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

  getDayName(day: number): string {
    return this.dayNames[day];
  }

  get periods(): number[] {
    return this.schedulePeriods.split(',').map(value => {
      return +value;
    });
  }
}
