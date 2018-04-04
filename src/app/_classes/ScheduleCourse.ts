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
    const schedules: string[] = this.scheduleView.split(/\),/);

    schedules.forEach(schedule => {
      if (schedule.indexOf(')') === -1) {
        schedule += ')';
      }
      const dayString = schedule.substring(schedule.indexOf('(') + 1, schedule.indexOf(')'));
      const days = dayString.split(',').map(dayRange => {
        if (dayRange.indexOf('-') >= 0) {
          const start = dayNames.indexOf(dayRange.substring(0, dayRange.indexOf('-')));
          const end = dayNames.indexOf(dayRange.substring(dayRange.indexOf('-') + 1));

          return Array.from({length: (end - start)}, (v, k) => k + start);
        } else {
          return dayNames.indexOf(dayRange);
        }
      });

      const daysFlattened = [].concat.apply([], days);
      daysFlattened.forEach(day => {
        const periodString = schedule.substring(0, schedule.indexOf('('));
        let periods = periodString.split(',').map(periodRange => {
          if (periodRange.indexOf('-') >= 0) {
            const start = +periodRange.substring(0, periodRange.indexOf('-'));
            const end = +periodRange.substring(periodRange.indexOf('-') + 1);

            return Array.from({length: (end - start)}, (v, k) => k + start);
          } else {
            return +periodRange;
          }
        });

        const ps = viewMap.get(day);
        if (ps) {
          periods = periods.concat(ps);
        }
        viewMap.set(day, [].concat.apply([], periods));
      });
    });

    return viewMap;
  }
}
