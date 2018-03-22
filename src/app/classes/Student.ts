export class Student {
  name: string;
  cabin: string;
  division: string;
  term: string;
  school: string;
  majorBySessionName: any;

  public static createFromJson(json: any): Student {
    const student = new Student();
    return Object.assign(student, json);
  }
}
