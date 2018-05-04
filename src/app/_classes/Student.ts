export class Student {
  lastName: string;
  firstName: string;
  cabin: string;
  division: string;
  term: string;
  school: string;
  majorBySessionName: any;

  public static createFromJson(json: any): Student {
    const student = new Student();
    return Object.assign(student, json);
  }

  get name(): string {
    return this.firstName + ' ' + this.lastName;
  }

  get housingDivision() {
    return this.cabin.split('-')[0];
  }

  public getMajorBySessionName(session: string): string {
    let major = this.majorBySessionName[session];

    if (!major) {
      // try to find a major in the 6 or 4 week sessions
      major = this.majorBySessionName['6 weeks'] || this.majorBySessionName['1st 4 weeks'] || this.majorBySessionName['2nd 4 weeks'];
    }

    return major;
  }
}
