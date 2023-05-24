import { request } from './request';
import { RiverDataError } from '../river-data-error';
import type { FloodApiResponse } from './request';

/**
 * A measure.
 */
export interface FloodApiMeasure {
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
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseMeasureId = (url: string): FloodApiMeasure => {
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

export const fetchMeasure = async (id: string) => {
  const measure = <FloodApiResponse<FloodApiMeasureDto>>(
    await request(`/id/measures/${id}`)
  );
  return measure;
};
