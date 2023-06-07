/**
 * A reading.
 */
export type Reading<T> = [
  t: number, // Unix epoch timestamp (seconds).
  v: number | null, // Value.
  a?: T // Additional information.
];
