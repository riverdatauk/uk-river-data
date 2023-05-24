import { expect } from 'chai';

import { parseMeasureId } from './measure';

import { RiverDataError } from '../river-data-error';
import { RiverDataErrorResponseError } from '../river-data-error-response-error';

describe('src/flood-api/measure', function () {
  describe('parseMeasureId', function () {
    it('should parse into parts', function () {
      const m = parseMeasureId('s/t/rip/this/abcd-efg-hi_9[-asd-*?"');
      expect(m).to.eql({
        id: 'abcd-efg-hi_9[-asd-*?"',
        station: 'abcd',
        parameter: 'efg',
        qualifier: 'hi_9[',
        qualifiedParameter: 'efg-hi_9[',
        interval: 'asd',
        unit: '*?"',
      });
    });

    it('should throw an error for an empty id', function () {
      expect(() => parseMeasureId('')).to.throw(
        RiverDataError,
        'Invalid measure id'
      );
    });

    it('should throw an error for an id with the wrong number of parts', function () {
      const longUrl = '/s/t-r/i/p/station-param-qual-inter-unit-extra';
      const shortUrl = '/s/t-r/i/p/station-param-qual-inter';
      expect(() => parseMeasureId(longUrl)).to.throw(
        RiverDataError,
        'Invalid measure id'
      );
      expect(() => parseMeasureId(shortUrl)).to.throw(
        RiverDataError,
        'Invalid measure id'
      );
    });
  });
});
