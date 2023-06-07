import type { Reading } from '../reading';

/** A single reading. */
export type HydrologyApiReading = Reading<HydrologyApiReadingMeta>;

/** Metadata for a single reading. */
export interface HydrologyApiReadingMeta {
  completeness?: string; // e.g. Complete.
  invalid?: string; // Percentage of data points which were invalid.
  missing?: string; // Percentage of data points which were missing.
  quality?: string; // e.g. Good, Unchecked.
  qcode?: string; // Other qualifiers for this reading.
  valid?: string; // Percentage of data points which were valid.
}

/** Criteria for a readings request. */
export interface HydrologyApiReadingCriteria {
  'station.wiskiID'?: string | string[];
}

/** Options for a readings request. */
export interface HydrologyApiReadingOptions {
  since?: Date; // Time from.
}

/** Data Transfer Object for a reading from the API. */
export interface HydrologyApiReadingDto {
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
  dtos: HydrologyApiReadingDto[]
): Record<string, HydrologyApiReading[]> => {
  // Collect the readings according to the measure ID URLs.
  const longIds: Record<string, HydrologyApiReading[]> = {};
  dtos.forEach((dto) => {
    const measureId = dto.measure['@id'];
    if (longIds[measureId] == null) {
      longIds[measureId] = [];
    }

    const readingMeta: HydrologyApiReadingMeta = {};
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
  const shortIds: Record<string, HydrologyApiReading[]> = {};
  Object.entries(longIds).forEach(([key, range]) => {
    shortIds[key.substring(key.lastIndexOf('/') + 1)] = range;
  });

  return shortIds;
};
