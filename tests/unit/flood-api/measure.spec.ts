import { expect } from 'chai';

import { fetchMeasure, parseMeasureId } from '../../../src/flood-api/measure';

import { RiverDataError } from '../../../src/river-data-error';
import { RiverDataResponseError } from '../../../src/river-data-response-error';

describe('src/flood-api/measure', function () {
  describe('fetchMeasure()', function () {
    it('should fetch from the correct url', async function () {
      this.timeout(10000);
      const { data: measure } = await fetchMeasure(
        '3400TH-flow--i-15_min-m3_s'
      );
      expect(measure?.id).to.equal('3400TH-flow--i-15_min-m3_s');
      expect(measure?.dto.stationReference).to.equal('3400TH');
    });

    it('should handle a 404 error', async function () {
      this.timeout(10000);
      try {
        await fetchMeasure('does-not-exist');
        throw new Error('Should not get here');
      } catch (e) {
        expect(e).to.be.instanceOf(RiverDataResponseError);
        expect((e as Error).message).to.equal('Not Found');
      }
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
