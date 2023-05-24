export class RiverDataError extends Error {
  public info: Record<string, unknown> = {};
  constructor(msg: string, info?: Record<string, unknown>) {
    super(msg);
    this.name = 'RiverDataError';
    if (info) {
      this.info = info;
    }
  }
}
