/**
 * A parsed response from the EA Flood Monitoring API.
 */
export interface FloodApiResponse<T> {
  response: Response;
  data: {
    '@context': string;
    meta: FloodApiResponseMetaDto;
    items: T;
  };
}

export interface FloodApiResponseMetaDto {
  publisher: string;
  license: string;
  documentation: string;
  version: string;
  comment: string;
  hasFormat: string[];
}
