import { RiverDataError } from '../river-data-error';
import { FloodApiClient, FloodApiResponseJson } from './client';
import type { RiverDataResponse } from '../river-data-client';

/**
 * A measure.
 */
export interface FloodApiMeasure {
  api: 'flood';
  id: string;
  dto: FloodApiMeasureDto;
}

/**
 * A measure.
 */
export interface FloodApiMeasureOptions {
  client?: FloodApiClient;
}

/**
 * Parsed parts of a measure.
 */
export interface FloodApiMeasureIdParts {
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
export interface FloodApiMeasureDto {
  '@id': string;
  label: string;
  latestReading: {
    '@id': string;
    date: string;
    dateTime: string;
    measure: string;
    value: number;
  };
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
  options: FloodApiMeasureOptions = {}
): Promise<
  RiverDataResponse<FloodApiMeasure, FloodApiResponseJson<FloodApiMeasureDto>>
> => {
  const client = options.client ?? new FloodApiClient();
  const res = await client.fetch<FloodApiResponseJson<FloodApiMeasureDto>>(
    `/id/measures/${id}`
  );

  const { response } = res;
  const json = res.json as FloodApiResponseJson<FloodApiMeasureDto>;

  // Get the response, casting the items to a Measure DTO.
  const data = parseMeasureDto(json.items);
  return { data, json, response };
};

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseMeasureDto = (dto: FloodApiMeasureDto): FloodApiMeasure => {
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
export const parseMeasureId = (url: string): FloodApiMeasureIdParts => {
  // Strip any path and split into parts.
  const id = url.slice(url.lastIndexOf('/') + 1);
  const parts = id.split('-');

  // Check we have the right number of parts.
  if (parts.length !== 5) {
    throw new RiverDataError('Invalid measure id', { url, id });
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
