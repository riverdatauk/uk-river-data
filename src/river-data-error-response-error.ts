export class RiverDataErrorResponseError extends Error {
  constructor(
    msg: string,
    public status: string | number,
    public options: {
      url: string;
      requestOptions: RequestInit;
      response: Response;
    }
  ) {
    super(msg);
    this.name = 'RiverDataErrorResponseError';
  }
}
