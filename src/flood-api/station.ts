import { FloodApiClient, FloodApiResponseJson } from './client';
import type { RiverDataResponse } from '../river-data-client';

/**
 * A station.
 */
export interface FloodApiStation {
  api: 'flood';
  id: string;
  dto: FloodApiStationDto;
}

/**
 * A station data transfer object.
 */
export interface FloodApiStationDto {
  '@id': string;
}

/**
 * A measure.
 */
export interface FloodApiStationOptions {
  client?: FloodApiClient;
}

/**
 * Fetch an identified station.
 */
export const fetchStation = async (
  id: string,
  options: FloodApiStationOptions = {}
): Promise<
  RiverDataResponse<FloodApiStation, FloodApiResponseJson<FloodApiStationDto>>
> => {
  const client = options.client ?? new FloodApiClient();
  const res = await client.fetch<FloodApiResponseJson<FloodApiStationDto>>(
    `/id/stations/${id}`
  );

  const { response } = res;
  const json = res.json as FloodApiResponseJson<FloodApiStationDto>;

  // Get the response, casting the items to a Measure DTO.
  const data = parseStationDto(json.items);
  return { data, json, response };
};

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseStationDto = (dto: FloodApiStationDto): FloodApiStation => {
  // Strip the path from the id.
  const id = dto['@id'].slice(dto['@id'].lastIndexOf('/') + 1);

  return {
    id,
    api: 'flood',
    dto,
  };
};
