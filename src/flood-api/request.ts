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

/**
 * Convert a Date to a format recognized by the EA API for a query parameter.
 *
 * @param date Convert from.
 * @returns A string in the EA API query parameter format.
 */
export const toTimeParameter = (date: Date): string => {
  return date.toISOString().substring(0, 19) + 'Z';
};
