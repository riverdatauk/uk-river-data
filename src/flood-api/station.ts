import { createClient } from './client';

import type {
  RiverDataClientOptions,
  RiverDataResponse,
} from '../river-data-client';
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
 * Scale information for a station.
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
  // e.g. stations/3399TH.
  gridReference?: string;
  easting: string;
  northing: string;
  lat: string;
  long: string;
  // e.g. stations/44239 (Kingston Russell GW) has a single measure.
  measures: MeasureDto | MeasureDto[];
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
 * Options for a station request.
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

  // Get the response and parse the DTO.
  const { response } = res;
  const json = res.json as ResponseJson<StationDto>;
  const data = parseStationDto(json.items);

  return { data, json, response };
};

/**
 * Fetch stations matching the request.
 *
 * parameter=p, parameterName=pn, qualifier=q, town=t, catchmentName=c,
 * riverName=r, RLOIid=r, lat=y&long=x&dist=r, search=x (text in label),
 * status=s, type=t
 */
export const fetchStations = async (
  query: Record<string, unknown>,
  options: StationOptions = {}
): Promise<RiverDataResponse<StationDto[], ResponseJson<StationDto[]>>> => {
  const client = options.client ?? (await createClient());
  const res = await client.fetch<ResponseJson<StationDto[]>>(`/id/stations`, {
    query: {
      _limit: '10000',
      _full: '',
    },
  });

  // Get the response and parse the DTO.
  const { response } = res;
  const json = res.json as ResponseJson<StationDto[]>;
  const data = json.items;

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
