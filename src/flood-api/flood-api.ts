import { parseMeasureDto, FloodApiMeasureDto, FloodApiMeasureResponse } from './measure';
import { apiRequest, ApiRequestOptions, ApiResponse } from '../api-request';
import { FloodApiResponse } from './request';

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
    const response = <FloodApiResponse<FloodApiMeasureDto>>(
      await this.fetch(`/id/measures/${id}`)
    );
    const measure = parseMeasureDto(response.data.items);
    return [measure, response];
  }
}
