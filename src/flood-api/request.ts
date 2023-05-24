import { RiverDataErrorResponseError } from '../river-data-error-response-error';

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
 * A parsed response from the EA Flood Monitoring API.
 */
export interface FloodApiRequestOptions {
  fetch?: (path: string, options?: RequestInit) => Promise<Response>;
  headers?: Headers;
  query?: Record<string, string>;
  options?: RequestInit;
}

const baseUrl = 'http://environment.data.gov.uk/flood-monitoring';

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const request = async (
  path: string,
  options: FloodApiRequestOptions = {}
): Promise<FloodApiResponse<unknown>> => {
  // Allow override of fecth.
  const localFetch = options.fetch || fetch;

  // Build the url adding any query parameters.
  const queryString = options.query ? new URLSearchParams(options.query).toString() : null;
  const url = queryString
    ? `${baseUrl}${path}?${queryString}`
    : `${baseUrl}${path}`;

  // Build the headers allowing any additions or overrides.
  const headers = new Headers(options.headers);
  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }

  const requestOptions: RequestInit = { headers, ...options.options };
  const response = await localFetch(url, requestOptions);

  // Deal with an HTTP error status.
  if (!response.ok) {
    // The API ignores the Accept header and just sends a page of unhelpful HTML
    // so we ignore this.
    // const body = await response.text();
    throw new RiverDataErrorResponseError(
      response.statusText,
      response.status,
      {
        url,
        requestOptions,
        response,
      }
    );
  }
  return { data: await response.json(), response };
};
