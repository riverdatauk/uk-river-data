import { RiverDataClient } from '../river-data-client';
import { parseReadingDtos } from './reading';

import type {
  HydrologyApiReadingCriteria,
  HydrologyApiReadingDto,
  HydrologyApiReadingOptions,
  HydrologyApiReading,
} from './reading';
import type { RiverDataResponse } from '../river-data-client';

export interface HydrologyApiResponseJson<T> {
  meta: Record<string, unknown>;
  items: T;
}

/**
 * Access data from the EA Flood Monitoring Real Time API.
 */
export class HydrologyApiClient extends RiverDataClient {
  protected baseUrl = 'https://environment.data.gov.uk/hydrology';

  /**
   * Find readings for a single measure or by criteria.
   *
   * optional criteria:
   * wiskiID
   *
   */

  async fetchReadings(
    id: string,
    options?: HydrologyApiReadingOptions
  ): Promise<
    RiverDataResponse<
      HydrologyApiReading[],
      HydrologyApiResponseJson<HydrologyApiReadingDto[]>
    >
  >;

  async fetchReadings(
    criteria: HydrologyApiReadingCriteria,
    options?: HydrologyApiReadingOptions
  ): Promise<
    RiverDataResponse<
      Record<string, HydrologyApiReading[]>,
      HydrologyApiResponseJson<HydrologyApiReadingDto[]>
    >
  >;

  async fetchReadings(
    idOrCriteria: string | HydrologyApiReadingCriteria,
    options: HydrologyApiReadingOptions = {}
  ) {
    const query: Record<string, string> = {
      _view: 'full',
      // _sort: 'dateTime',
      latest: '',
    };

    if (typeof idOrCriteria === 'string') {
      // Request readings for the identified measure.
      const { json, response } = await this.fetch<
        HydrologyApiResponseJson<HydrologyApiReadingDto[]>
      >(`/id/measures/${idOrCriteria}/readings`, {
        query,
      });

      // Get the response, casting the items to ReadingDTOs.
      const data = parseReadingDtos(json ? json.items : [])[idOrCriteria] || [];
      return <
        RiverDataResponse<
          HydrologyApiReading[],
          HydrologyApiResponseJson<HydrologyApiReadingDto[]>
        >
      >{ data, json, response };
    }

    // Request readings using the given criteria.
    for (const [key, value] of Object.entries(idOrCriteria)) {
      query[key] = value;
    }

    const { json, response } = await this.fetch<
      HydrologyApiResponseJson<HydrologyApiReadingDto[]>
    >(`/data/readings`, {
      query,
    });

    // Get the response, casting the items to ReadingDTOs.
    const data = parseReadingDtos(json ? json.items : []) || {};
    return <
      RiverDataResponse<
        Record<string, HydrologyApiReading[]>,
        HydrologyApiResponseJson<HydrologyApiReadingDto[]>
      >
    >{ data, json, response };
  }
}
