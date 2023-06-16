import { RiverDataClient } from '../river-data-client';

export interface ResponseJson<T> {
  meta: Record<string, unknown>;
  items: T;
}

/**
 * Access data from the EA Flood Monitoring Real Time API.
 */
export class Client extends RiverDataClient {
  protected baseUrl = 'https://environment.data.gov.uk/hydrology';
}

export const createClient = async () => {
  return new Client();
};
