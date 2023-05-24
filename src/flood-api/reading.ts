import { request } from './request';
import { RiverDataError } from '../river-data-error';
import type { FloodApiResponse } from './request';
import type { Reading } from '../reading';

/**
 * A reading (internal).
 */
export type FloodApiReading = Reading<undefined>;

/**
 * A reading (external).
 */
export interface FloodApiReadingDto {
  '@id': string; // The URL of this reading.
  dateTime: string; // e.g. '2023-05-13T09:00:00Z'.
  measure: string; // The URL of the measure.
  value: number; // The value in the appropriate units.
}

/**
 * Fetch readings for a measure.
 */
export const fetchMeasureReadings = async (measureId: string) => {
  const query = { _sorted: '' };

  if (options.since) {
    query.since = toTimeParameter(options.since);
  }

  const response = <FloodApiResponse<FloodApiReadingDto[]>>(
    await request(`/id/measures/${measureId}/readings`, { query })
  );

  // Get the response, casting the items to ReadingDTOs.
  return [parseReadingDtos(response.data.items)[id] || [], response];
};
