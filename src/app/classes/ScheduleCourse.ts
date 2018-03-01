export class ScheduleCourse {
  public courseName: string;
  public instructor: string;
  public location: string;
  private schedule: string;

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
    // 2-3,7-8(Mon-Sat)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayString = this.schedule.substring(this.schedule.indexOf('(') + 1, this.schedule.indexOf(')'));
    const days = dayString.split(',').map(value => {
      if (value.indexOf('-') >= 0) {
        const start = dayNames.indexOf(value.substring(0, value.indexOf('-')));
        const end = dayNames.indexOf(value.substring(value.indexOf('-') + 1));

        return Array.from({length: (end - start + 1)}, (v, k) => k + start);
      } else {
        return dayNames.indexOf(value);
      }
    });

    return [].concat.apply([], days);
  }

  get periods(): number[] {
    // 2-3,7-8(Mon-Sat)
    const periodString = this.schedule.substring(0, this.schedule.indexOf('('));
    const periods = periodString.split(',').map(value => {
      if (value.indexOf('-') >= 0) {
        const start = +value.substring(0, value.indexOf('-'));
        const end = +value.substring(value.indexOf('-') + 1);

        return Array.from({length: (end - start + 1)}, (v, k) => k + start);
      } else {
        return +value;
      }
    });

    return [].concat.apply([], periods);
  }
}
