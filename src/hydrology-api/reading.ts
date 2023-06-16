import { createClient } from './client';

import type { RiverDataResponse } from '../river-data-client';
import type { Client, ResponseJson } from './client';
import type { Reading as BaseReading } from '../reading';

/** A single reading. */
export type Reading = BaseReading<ReadingMeta>;

/** Metadata for a single reading. */
export interface ReadingMeta {
  completeness?: string; // e.g. Complete.
  invalid?: string; // Percentage of data points which were invalid.
  missing?: string; // Percentage of data points which were missing.
  quality?: string; // e.g. Good, Unchecked.
  qcode?: string; // Other qualifiers for this reading.
  valid?: string; // Percentage of data points which were valid.
}

/** Criteria for a readings request. */
export interface ReadingCriteria {
  'station.wiskiID'?: string | string[];
}

/** Options for a readings request. */
export interface ReadingOptions {
  client?: Client;
}

/** Data Transfer Object for a reading from the API. */
export interface ReadingDto {
  completeness?: string; // e.g. Complete.
  date: string; // e.g. '2023-05-13'.
  dateTime: string; // e.g. '2023-05-13T09:00:00'.
  invalid?: string; // Percentage of data points which were invalid.
  measure: {
    '@id': string; // The URL of the measure.
  };
  missing?: string; // Percentage of data points which were missing.
  quality?: string; // e.g. Good, Unchecked.
  qcode?: string; // Other qualifiers for this reading.
  valid?: string; // Percentage of data points which were valid.
  value?: number; // The value in the appropriate units.
}

/**
 * Parse API response data into readings.
 *
 * @param dtos Array of data transfer objects from an API response.
 * @returns Object keyed by measure id with arrays of readings as entries.
 */
export const parseReadingDtos = (
  dtos: ReadingDto[]
): Record<string, Reading[]> => {
  // Collect the readings according to the measure ID URLs.
  const longIds: Record<string, Reading[]> = {};
  dtos.forEach((dto) => {
    const measureId = dto.measure['@id'];
    if (longIds[measureId] == null) {
      longIds[measureId] = [];
    }

    const readingMeta: ReadingMeta = {};
    // Although the API docs say completeness is not optional this is not true
    // in practice.
    if (dto.completeness != null) readingMeta.completeness = dto.completeness;
    if (dto.quality != null) readingMeta.quality = dto.quality;
    if (dto.invalid != null) readingMeta.invalid = dto.invalid;
    if (dto.missing != null) readingMeta.missing = dto.missing;
    if (dto.qcode != null) readingMeta.qcode = dto.qcode;
    if (dto.valid != null) readingMeta.valid = dto.valid;

    const dateTime =
      dto.dateTime.slice(-1) === 'Z' ? dto.dateTime : `${dto.dateTime}Z`;

    longIds[measureId].unshift([
      new Date(dateTime).valueOf() / 1000,
      dto.value ?? null,
      readingMeta,
    ]);
  });

  // Strip the URLs from the measure IDs.
  const shortIds: Record<string, Reading[]> = {};
  Object.entries(longIds).forEach(([key, range]) => {
    shortIds[key.substring(key.lastIndexOf('/') + 1)] = range;
  });

  return shortIds;
};

/**
 * Find readings for a single measure or by criteria.
 *
 * optional criteria:
 * wiskiID
 *
 */
/*
const fetchReadings = async (
  id: string,
  options?: ReadingOptions
) => Promise<
  RiverDataResponse<
    Reading[],
    ResponseJson<ReadingDto[]>
  >
>;

const fetchReadings = async (
  async fetchReadings(
  criteria: ReadingCriteria,
  options?: ReadingOptions
) => Promise<
  RiverDataResponse<
    Record<string, Reading[]>,
    ResponseJson<ReadingDto[]>
  >
>;
*/
export const fetchReadings = async (
  idOrCriteria: string | ReadingCriteria,
  options: ReadingOptions = {}
) => {
  const query: Record<string, string> = {
    _view: 'full',
    // _sort: 'dateTime',
    latest: '',
  };

  if (typeof idOrCriteria === 'string') {
    // Request readings for the identified measure.
    const client = options.client ?? (await createClient());
    const { json, response } = await client.fetch<ResponseJson<ReadingDto[]>>(
      `/id/measures/${idOrCriteria}/readings`,
      {
        query,
      }
    );

    // Get the response, casting the items to ReadingDTOs.
    const data = parseReadingDtos(json ? json.items : [])[idOrCriteria] || [];
    return <RiverDataResponse<Reading[], ResponseJson<ReadingDto[]>>>{
      data,
      json,
      response,
    };
  }

  // Request readings using the given criteria.
  for (const [key, value] of Object.entries(idOrCriteria)) {
    query[key] = value;
  }

  const client = options.client ?? (await createClient());
  const { json, response } = await client.fetch<ResponseJson<ReadingDto[]>>(
    `/data/readings`,
    {
      query,
    }
  );

  // Get the response, casting the items to ReadingDTOs.
  const data = parseReadingDtos(json ? json.items : []) || {};
  return <
    RiverDataResponse<Record<string, Reading[]>, ResponseJson<ReadingDto[]>>
  >{ data, json, response };
};
