import { expect } from 'chai';

import { RiverDataResponseError } from '../../../src/river-data-response-error';

import { FloodApiClient } from '../../../src/flood-api/flood-api-client';

describe('The FloodApi class', function () {
  describe('fetchMeasure()', function () {
    it('should fetch from the correct url', async function () {
      this.timeout(10000);
      const floodApi = new FloodApiClient();
      const { data: measure } = await floodApi.fetchMeasure(
        '3400TH-flow--i-15_min-m3_s'
      );
      expect(measure?.id).to.equal('3400TH-flow--i-15_min-m3_s');
      expect(measure?.dto.stationReference).to.equal('3400TH');
    });

    it('should handle a 404 error', async function () {
      this.timeout(10000);
      const floodApi = new FloodApiClient();
      try {
        await floodApi.fetchMeasure('does-not-exist');
        throw new Error('Should not get here');
      } catch (e) {
        expect(e).to.be.instanceOf(RiverDataResponseError);
        expect((e as Error).message).to.equal('Not Found');
      }
    });
  });

  describe('fetchMeasureReadings()', function () {
    it('should fetch readings from a date', async function () {
      this.timeout(10000);
      const floodApi = new FloodApiClient();
      const now = new Date().valueOf();
      const { data: readings } = await floodApi.fetchMeasureReadings(
        '3400TH-flow--i-15_min-m3_s',
        { since: new Date(now - 86400000) }
      );

      // Should be 23-24 hours of readings.
      expect(readings?.length).to.be.within(23 * 4, 24 * 4);

      // Most recent should be within the last hour.
      const [mostRecent] = readings?.pop() || [0];
      expect(now / 1000 - mostRecent).to.be.within(0, 3600);
    });
  });
});
