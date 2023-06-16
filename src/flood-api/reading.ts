import { toTimeParameter, createClient } from './client';

import type { ResponseJson, Client } from './client';
import type { RiverDataResponse } from '../river-data-client';
import type { Reading as BaseReading } from '../reading';

/**
 * A reading (internal).
 */
export type Reading = BaseReading<undefined>;

/**
 * A reading (external).
 */
export interface ReadingDto {
  '@id': string; // The URL of this reading.
  dateTime: string; // e.g. '2023-05-13T09:00:00Z'.
  measure: string; // The URL of the measure.
  value: number; // The value in the appropriate units.
}

export interface ReadingOptions {
  client?: Client;
  since?: Date; // Time from.
}

/**
 * Fetch readings for a measure.
 */
export const fetchMeasureReadings = async (
  measureId: string,
  options: ReadingOptions = {}
): Promise<RiverDataResponse<Reading[], ResponseJson<ReadingDto[]>>> => {
  const query: Record<string, string> = { _sorted: '' };

  if (options.since) {
    query.since = toTimeParameter(options.since);
  }

  const client = options.client ?? (await createClient());
  const res = await client.fetch<ResponseJson<ReadingDto[]>>(
    `/id/measures/${measureId}/readings`,
    {
      query,
    }
  );

  const { response } = res;
  const json = res.json as ResponseJson<ReadingDto[]>;

  // Get the response, casting the items to ReadingDTOs.
  const data = parseReadingDtos(json.items)[measureId];
  return { data, json, response };
};

export const parseReadingDtos = (
  dtos: ReadingDto[]
): Record<string, Reading[]> => {
  // Collect the readings according to the measure ID URLs.
  const longIds: Record<string, Reading[]> = {};
  dtos.forEach(({ measure, dateTime, value }) => {
    if (longIds[measure] == null) {
      longIds[measure] = [];
    }
    longIds[measure].unshift([new Date(dateTime).valueOf() / 1000, value]);
  });

  // Strip the URLs from the measure IDs.
  const shortIds: Record<string, Reading[]> = {};
  Object.entries(longIds).forEach(([key, range]) => {
    shortIds[key.substring(key.lastIndexOf('/') + 1)] = range;
  });

  return shortIds;
};
