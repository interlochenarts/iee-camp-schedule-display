export class ScheduleCourse {
  public _courseName: string;
  public instructor: string;
  public location: string;
  public scheduleView: string;
  public scheduleNotes: string;
  public practiceHourMap: Map<number, number[]> = new Map<number, number[]>();
  public scheduleViewMap: Map<number, number[]>;
  public practiceBuilding: string;

  public static createFromJson(json: JSON): ScheduleCourse {
    const scheduleCourse = new ScheduleCourse(null);
    Object.assign(scheduleCourse, json);

    if (scheduleCourse.courseName.toLowerCase().includes('private')) {
      scheduleCourse.instructor = scheduleCourse.privateLessonTeacher;
      scheduleCourse.location = scheduleCourse.privateLessonLocation;
      scheduleCourse.scheduleView = (scheduleCourse.scheduleNotesArray[0] || scheduleCourse.scheduleView);
      scheduleCourse.setScheduleViewMap();
      scheduleCourse.setPracticeHourMap();
    } else {
      scheduleCourse.setScheduleViewMap();
    }

    return scheduleCourse;
  }

  set courseName(cn: string) {
    this._courseName = cn;
  }

  get courseName(): string {
    if (this._courseName.startsWith('JR') || this._courseName.startsWith('INT') || this._courseName.startsWith('HS')) {
      return this._courseName.substr(this._courseName.indexOf(' '));
    } else {
      return this._courseName;
    }
  }

  constructor(courseName: string) {
    if (courseName) {
      this.courseName = courseName;
    }
  }

  get scheduleNotesArray(): string[] {
    if (this.scheduleNotes && this.scheduleNotes.includes('|') && this.courseName.toLowerCase().includes('private')) {
      return this.scheduleNotes.split('|');
    }

    return [];
  }

  get privateLessonTeacher(): string {
    return this.scheduleNotesArray[1];
  }

  get privateLessonLocation(): string {
    return this.scheduleNotesArray[2];
  }

  setPracticeHourMap(): void {
    // only do this work if something exists in the first value of schedule notes
    // and if it's a private lesson class
    if (this.scheduleNotesArray[0] && this.courseName.toLowerCase().includes('private')) {
      const practices = new Map<number, number[]>();

      const lessonDays = Array.from(this.scheduleViewMap.keys());
      const practiceDays = Array.from(
        {length: 7},
        (v, k) => k)
        .filter(v => {
          return lessonDays.indexOf(v) === -1;
        }).forEach(v => {
          practices.set(v, this.scheduleViewMap.get(lessonDays[0]));
        });

      this.practiceHourMap = practices;
    } else {
      this.practiceHourMap = new Map<number, number[]>();
    }
  }

  setScheduleViewMap(): void {
    if (this.scheduleView) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Map day (number) -> period list (numbers)
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

            return Array.from({length: (end - start + 1)}, (v, k) => k + start);
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

              return Array.from({length: (end - start + 1)}, (v, k) => k + start);
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

      this.scheduleViewMap = viewMap;
    } else {
      this.scheduleViewMap = new Map<number, number[]>();
    }

  }
}
