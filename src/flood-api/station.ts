import { createClient } from './client';

import type { RiverDataResponse } from '../river-data-client';
import type { Client, ResponseJson } from './client';
import { MeasureDto } from './measure';

/**
 * A station.
 */
export interface Station {
  api: 'flood';
  id: string;
  dto: StationDto;
}

/**
 * A station.
 */
export interface Scale {
  '@id': string;
  datum: number;
  highestRecent: {
    '@id': string;
    dateTime: string;
    value: number;
  };
  maxOnRecord: {
    '@id': string;
    dateTime: string;
    value: number;
  };
  minOnRecord: {
    '@id': string;
    dateTime: string;
    value: number;
  };
  scaleMax: number;
  typicalRangeHigh: number;
  typicalRangeLow: number;
}

/**
 * A station data transfer object.
 */
export interface StationDto {
  '@id': string;
  label: string;
  RLOIid: string;
  catchmentName: string;
  dateOpened: string;
  eaAreaName: string;
  eaRegionName: string;
  easting: string;
  northing: string;
  lat: string;
  long: string;
  measures: MeasureDto[];
  notation: string;
  riverName: string;
  stageScale?: Scale | string;
  downstageScale?: Scale | string;
  stationReference: string;
  status: string;
  town: string;
  type: string;
  wiskiID: string;
}

/**
 * A measure.
 */
export interface StationOptions {
  client?: Client;
}

/**
 * Fetch an identified station.
 */
export const fetchStation = async (
  id: string,
  options: StationOptions = {}
): Promise<RiverDataResponse<Station, ResponseJson<StationDto>>> => {
  const client = options.client ?? (await createClient());
  const res = await client.fetch<ResponseJson<StationDto>>(
    `/id/stations/${id}`
  );

  const { response } = res;
  const json = res.json as ResponseJson<StationDto>;

  // Get the response, casting the items to a Measure DTO.
  const data = parseStationDto(json.items);
  return { data, json, response };
};

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseStationDto = (dto: StationDto): Station => {
  // Strip the path from the id.
  const id = dto['@id'].slice(dto['@id'].lastIndexOf('/') + 1);

  return {
    id,
    api: 'flood',
    dto,
  };
};
