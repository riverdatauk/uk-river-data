import { RiverDataErrorResponseError } from './river-data-error-response-error';

/**
 * A parsed response.
 */
export interface ApiResponse {
  data: Record<string, unknown>;
  response: Response;
}

/**
 * Request options.
 */
export interface ApiRequestOptions {
  fetch?: (path: string, options?: RequestInit) => Promise<Response>;
  headers?: Headers;
  query?: Record<string, string>;
  options?: RequestInit;
}

/**
 * Make a request.
 */
export const apiRequest = async (
  plainUrl: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse> => {
  // Allow override of fecth.
  const localFetch = options.fetch || fetch;

  // Build the url adding any query parameters.
  const queryString = options.query
    ? new URLSearchParams(options.query).toString()
    : null;
  const url = queryString ? `${plainUrl}?${queryString}` : plainUrl;

  // Build the headers allowing any additions or overrides.
  const headers = new Headers(options.headers);
  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }

  const requestOptions: RequestInit = { headers, ...options.options };
  const response = await localFetch(url, requestOptions);

  // Deal with an HTTP error status.
  if (!response.ok) {
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
