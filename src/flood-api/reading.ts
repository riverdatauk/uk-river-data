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

export interface FloodApiReadingOptions {
  since?: Date; // Time from.
}

export const parseReadingDtos = (
  dtos: FloodApiReadingDto[]
): Record<string, FloodApiReading[]> => {
  // Collect the readings according to the measure ID URLs.
  const longIds: Record<string, FloodApiReading[]> = {};
  dtos.forEach(({ measure, dateTime, value }) => {
    if (longIds[measure] == null) {
      longIds[measure] = [];
    }
    longIds[measure].unshift([new Date(dateTime).valueOf() / 1000, value]);
  });

  // Strip the URLs from the measure IDs.
  const shortIds: Record<string, FloodApiReading[]> = {};
  Object.entries(longIds).forEach(([key, range]) => {
    shortIds[key.substring(key.lastIndexOf('/') + 1)] = range;
  });

  return shortIds;
};
