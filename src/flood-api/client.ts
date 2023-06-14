import { RiverDataClient, RiverDataResponse } from '../river-data-client';

/**
 * A parsed response from the EA Flood Monitoring API.
 */
export interface FloodApiResponseJson<T> {
  '@context': string;
  meta: FloodApiResponseMetaDto;
  items: T;
}

export interface FloodApiResponseMetaDto {
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
export class FloodApiClient extends RiverDataClient {
  protected baseUrl = 'http://environment.data.gov.uk/flood-monitoring';
}

/**
 * Convert a Date to a format recognized by the EA API for a query parameter.
 *
 * @param date Convert from.
 * @returns A string in the EA API query parameter format.
 */
export const toTimeParameter = (date: Date): string => {
  return date.toISOString().substring(0, 19) + 'Z';
};
