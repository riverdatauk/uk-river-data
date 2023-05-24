import { apiRequest, ApiRequestOptions, ApiResponse } from '../api-request';

import {
  parseMeasureId,
  parseMeasureDto,
  FloodApiMeasureDto,
  FloodApiMeasureResponse,
} from './measure';

import {
  parseReadingDtos,
  FloodApiReadingDto,
  FloodApiMeasureReadingsResponse,
  FloodApiReadingOptions,
} from './reading';

import { toTimeParameter, FloodApiResponse } from './request';

/**
 * Access data from the EA Flood Monitoring Real Time API.
 */
export class FloodApi {
  protected baseUrl = 'http://environment.data.gov.uk/flood-monitoring';

  /**
   * Make a request to the API.
   */
  async fetch(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse> {
    return apiRequest(`${this.baseUrl}${path}`, options);
  }

  /**
   * Fetch an identified measure.
   */
  async fetchMeasure(id: string): Promise<FloodApiMeasureResponse> {
    const response = (await this.fetch(
      `/id/measures/${id}`
    )) as FloodApiResponse<FloodApiMeasureDto>;
    const measure = parseMeasureDto(response.data.items);
    return [measure, response];
  }

  /**
   * Fetch readings for a measure.
   */
  async fetchMeasureReadings(
    measureId: string,
    options: FloodApiReadingOptions = {}
  ): Promise<FloodApiMeasureReadingsResponse> {
    const query: Record<string, string> = { _sorted: '' };

    if (options.since) {
      query.since = toTimeParameter(options.since);
    }

    const response = (await this.fetch(`/id/measures/${measureId}/readings`, {
      query,
    })) as FloodApiResponse<FloodApiReadingDto[]>;

    // Get the response, casting the items to ReadingDTOs.
    return [parseReadingDtos(response.data.items)[measureId] || [], response];
  }

  static parseMeasureId = parseMeasureId;
}
