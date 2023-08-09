import { RiverDataClient } from '../river-data-client';

/**
 * A parsed response from the EA Flood Monitoring API.
 */
export interface ResponseJson<T> {
  '@context': string;
  meta: ResponseMetaDto;
  items: T;
}

export interface ResponseMetaDto {
  publisher: string;
  license: string;
  documentation: string;
  version: string;
  comment: string;
  hasFormat: string[];
}

/**
 * Access data from the EA Flood Monitoring Real Time API.
 */
export class Client extends RiverDataClient {
  protected baseUrl = 'http://environment.data.gov.uk/flood-monitoring';
}

export const createClient = async () => {
  return new Client();
};

/**
 * Convert a Date to a format recognized by the EA API for a query parameter.
 *
 * @param date Convert from.
 * @returns A string in the EA API query parameter format.
 */
export const toTimeParameter = (date: Date): string => {
  return date.toISOString().slice(0, 19) + 'Z';
};
