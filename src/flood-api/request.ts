/**
 * Convert a Date to a format recognized by the EA API for a query parameter.
 *
 * @param date Convert from.
 * @returns A string in the EA API query parameter format.
 */
export const toTimeParameter = (date: Date): string => {
  return date.toISOString().substring(0, 19) + 'Z';
};
