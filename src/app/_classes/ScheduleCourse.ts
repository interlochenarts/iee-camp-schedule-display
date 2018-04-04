export class ScheduleCourse {
  public courseName: string;
  public instructor: string;
  public location: string;
  public scheduleView: string;

  public static createFromJson(json: JSON): ScheduleCourse {
    const scheduleCourse = new ScheduleCourse(null);
    return Object.assign(scheduleCourse, json);
  }

  constructor(courseName: string) {
    if (courseName) {
      this.courseName = courseName;
    }
  }

  get scheduleViewMap(): Map<number, number[]> {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const viewMap: Map<number, number[]> = new Map<number, number[]>();
    const schedules: string[] = this.scheduleView.split(',');

    schedules.forEach(schedule => {
      const dayString = schedule.substring(this.schedule.indexOf('(') + 1, this.schedule.indexOf(')'));
      const days = dayString.split(',').map(dayRange => {
        if (dayRange.indexOf('-') >= 0) {
          const start = dayNames.indexOf(dayRange.substring(0, dayRange.indexOf('-')));
          const end = dayNames.indexOf(dayRange.substring(dayRange.indexOf('-') + 1));

          return Array.from({length: (end - start)}, (v, k) => k + start);
        } else {
          return dayNames.indexOf(dayRange);
        }
      });
    });
  }

  get days(): number[] {
    // 2-3,7-8(Mon-Sat)
    const dayString = this.schedule.substring(this.schedule.indexOf('(') + 1, this.schedule.indexOf(')'));
    const days = dayString.split(',').map(value => {
      if (value.indexOf('-') >= 0) {
        const start = dayNames.indexOf(value.substring(0, value.indexOf('-')));
        const end = dayNames.indexOf(value.substring(value.indexOf('-') + 1));

        return Array.from({length: (end - start)}, (v, k) => k + start);
      } else {
        return dayNames.indexOf(value);
      }
    });

    return [].concat.apply([], days);
  }

  get periods(): number[] {
    // 2-3,7-8(Mon-Sat)
    const periodString = this.schedule.substring(0, this.schedule.indexOf('('));
    const periods = periodString.split(',').map((value) => {
      if (value.indexOf('-') >= 0) {
        const start = +value.substring(0, value.indexOf('-'));
        const end = +value.substring(value.indexOf('-') + 1);

        return Array.from({length: (end - start)}, (v, k) => k + start);
      } else {
        return +value;
      }
    });

    return [].concat.apply([], periods);
  }
}
