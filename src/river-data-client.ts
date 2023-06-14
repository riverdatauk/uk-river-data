import { RiverDataResponseError } from './river-data-response-error';

/**
 * A successful response.
 */
export interface RiverDataResponse<T, J> {
  data: T;
  json?: J;
  body?: string;
  response: Response;
}

export interface RiverDataClientOptions {
  fetch?: (path: string, options?: RequestInit) => Promise<Response>;
}

/**
 * Request options.
 */
export interface RiverDataRequestOptions {
  headers?: Headers;
  query?: Record<string, string>;
  options?: RequestInit;
}

export class RiverDataClient {
  protected baseUrl = '';

  protected useFetch:
    | ((path: string, options?: RequestInit) => Promise<Response>)
    | null;

  constructor(options: RiverDataClientOptions = {}) {
    this.useFetch = options.fetch ?? null;
  }

  /**
   * Make a request to the API.
   */
  async fetch<T>(
    path: string,
    options: RiverDataRequestOptions = {}
  ): Promise<RiverDataResponse<undefined, T>> {
    // Build the url adding any query parameters.
    const queryString = options.query
      ? new URLSearchParams(options.query).toString()
      : null;
    const url = queryString
      ? `${this.baseUrl}${path}?${queryString}`
      : `${this.baseUrl}${path}`;

    // Build the headers allowing any additions or overrides.
    const headers = new Headers(options.headers);
    if (!headers.has('accept')) {
      headers.set('accept', 'application/json');
    }

    // Build the request options allowing any additions or overrides.
    const requestOptions: RequestInit = { headers, ...options.options };

    // Send the request using native `fetch` or an override.
    const response = await (this.useFetch
      ? this.useFetch(url, requestOptions)
      : fetch(url, requestOptions));

    // Deal with an HTTP error status.
    if (!response.ok) {
      throw new RiverDataResponseError(response.statusText, response.status, {
        url,
        requestOptions,
        response,
      });
    }

    const body = await response.text();

    try {
      // Return json if we can...
      return { data: undefined, json: JSON.parse(body) as T, response };
    } catch (err) {
      // ...otherwise the body.
      return { data: undefined, body, response };
    }
  }
}
