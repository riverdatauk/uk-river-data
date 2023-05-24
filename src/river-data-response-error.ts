export class RiverDataResponseError extends Error {
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
    this.name = 'RiverDataResponseError';
  }
}
