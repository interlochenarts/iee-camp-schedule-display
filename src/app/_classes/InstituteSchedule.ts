export class InstituteSchedule {
  public session;
  public pdfLink;
  public scheduleLink;

  public static createFromJson(json: JSON): InstituteSchedule {
    const instituteSchedule = new InstituteSchedule();
    return Object.assign(instituteSchedule, json);
  }
}
