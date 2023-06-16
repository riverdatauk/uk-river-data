import { RiverDataError } from '../river-data-error';
import { createClient } from './client';

import type { Client, ResponseJson } from './client';
import type { RiverDataResponse } from '../river-data-client';

export interface LatestReading {
  '@id': string;
  date: string;
  dateTime: string;
  measure: string;
  value: number;
}

/**
 * A measure.
 */
export interface Measure {
  api: 'flood';
  id: string;
  dto: MeasureDto;
}

/**
 * A measure.
 */
export interface MeasureOptions {
  client?: Client;
}

/**
 * Parsed parts of a measure.
 */
export interface MeasureIdParts {
  id: string;
  station: string;
  parameter: string;
  qualifier: string;
  qualifiedParameter: string;
  interval: string;
  unit: string;
}

/**
 * A measure.
 */
export interface MeasureDto {
  '@id': string;
  label: string;
  latestReading: LatestReading | string;
  notation: string;
  parameter: string;
  parameterName: string;
  period: number;
  qualifier: string;
  station: string;
  stationReference: string;
  type: string[];
  unit: string;
  unitName: string;
  valueType: string;
}

/**
 * Fetch an identified measure.
 */
export const fetchMeasure = async (
  id: string,
  options: MeasureOptions = {}
): Promise<RiverDataResponse<Measure, ResponseJson<MeasureDto>>> => {
  const client = options.client ?? (await createClient());
  const res = await client.fetch<ResponseJson<MeasureDto>>(
    `/id/measures/${id}`
  );

  const { response } = res;
  const json = res.json as ResponseJson<MeasureDto>;

  // Get the response, casting the items to a Measure DTO.
  const data = parseMeasureDto(json.items);
  return { data, json, response };
};

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseMeasureDto = (dto: MeasureDto): Measure => {
  // Strip the path from the id.
  const id = dto['@id'].slice(dto['@id'].lastIndexOf('/') + 1);

  return {
    id,
    api: 'flood',
    dto,
  };
};

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseMeasureId = (url: string): MeasureIdParts => {
  // Strip any path and split into parts.
  const id = url.slice(url.lastIndexOf('/') + 1);
  const parts = id.split('-');

  // Check we have the right number of parts.
  if (parts.length !== 5) {
    throw new RiverDataError('Invalid measure id', { id });
  }

  const [station, parameter, qualifier, interval, unit] = parts;
  const qualifiedParameter = `${parameter}-${qualifier}`;
  return {
    id,
    station,
    parameter,
    qualifier,
    qualifiedParameter,
    interval,
    unit,
  };
};
