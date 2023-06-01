export class ProgramMajor {
  name: string;
  session: string;

  public static createFromJson(json: any): ProgramMajor {
    const programMajor = new ProgramMajor();
    Object.assign(programMajor, json);

    return programMajor;
  }
}
