/**
 * A reading.
 */
export type Reading<T> = [
  t: number, // Unix epoch timestamp (seconds).
  v: number, // Value.
  a?: T // Additional information.
];
