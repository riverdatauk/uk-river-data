import { expect } from 'chai';

import { fetchMeasure, parseMeasureId } from './measure';

import { RiverDataError } from '../river-data-error';
import { RiverDataErrorResponseError } from '../river-data-error-response-error';

describe('src/flood-api/measure', function () {
  describe('fetchMeasure()', function () {
    it('should fetch from the correct url', async function () {
      const response = await fetchMeasure('3400TH-flow--i-15_min-m3_s');
      expect(response.data?.items.stationReference).to.equal('3400TH');
    });

    it('should handle a 404 error', async function (done) {
      expect(fetchMeasure('3400TH-flow--i-15_min-m3_s')).to.be.rejectedWith(
        RiverDataErrorResponseError,
        'Not Found'
      );
      done();
    });
  });

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
