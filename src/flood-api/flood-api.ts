import { parseMeasureId, fetchMeasure } from './measure';

/**
 * Access data from the EA Flood Monitoring Real Time API.
 */
export class FloodApi {
  static parseMeasureId = parseMeasureId;
  static fetchMeasure = fetchMeasure;
}
