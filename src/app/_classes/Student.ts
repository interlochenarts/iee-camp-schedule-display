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
}
