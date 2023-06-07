import { RiverDataClient, RiverDataResponse } from '../river-data-client';

import {
  parseMeasureId,
  parseMeasureDto,
  FloodApiMeasureDto,
  FloodApiMeasure,
} from './measure';

import {
  parseReadingDtos,
  FloodApiReading,
  FloodApiReadingDto,
  FloodApiReadingOptions,
} from './reading';

import { toTimeParameter } from './request';

/**
 * A parsed response from the EA Flood Monitoring API.
 */
export interface FloodApiResponseJson<T> {
  '@context': string;
  meta: FloodApiResponseMetaDto;
  items: T;
}

export interface FloodApiResponseMetaDto {
  publisher: string;
  license: string;
  documentation: string;
  version: string;
  comment: string;
  hasFormat: string[];
}

/**
 * Access data from the EA Flood Monitoring Real Time API.
 */
export class FloodApiClient extends RiverDataClient {
  protected baseUrl = 'http://environment.data.gov.uk/flood-monitoring';

  /**
   * Fetch an identified measure.
   */
  async fetchMeasure(
    id: string
  ): Promise<
    RiverDataResponse<FloodApiMeasure, FloodApiResponseJson<FloodApiMeasureDto>>
  > {
    const res = await this.fetch<FloodApiResponseJson<FloodApiMeasureDto>>(
      `/id/measures/${id}`
    );

    const { response } = res;
    const json = res.json as FloodApiResponseJson<FloodApiMeasureDto>;

    // Get the response, casting the items to a Measure DTO.
    const data = parseMeasureDto(json.items);
    return { data, json, response };
  }

  /**
   * Fetch readings for a measure.
   */
  async fetchMeasureReadings(
    measureId: string,
    options: FloodApiReadingOptions = {}
  ): Promise<
    RiverDataResponse<
      FloodApiReading[],
      FloodApiResponseJson<FloodApiReadingDto[]>
    >
  > {
    const query: Record<string, string> = { _sorted: '' };

    if (options.since) {
      query.since = toTimeParameter(options.since);
    }

    const res = await this.fetch<FloodApiResponseJson<FloodApiReadingDto[]>>(
      `/id/measures/${measureId}/readings`,
      {
        query,
      }
    );

    const { response } = res;
    const json = res.json as FloodApiResponseJson<FloodApiReadingDto[]>;

    // Get the response, casting the items to ReadingDTOs.
    const data = parseReadingDtos(json.items)[measureId];
    return { data, json, response };
  }

  static parseMeasureId = parseMeasureId;
}
