import { expect } from 'chai';

import { fetchMeasureReadings } from '../../../src/flood-api/reading';

describe('The FloodApi class', function () {
  describe('fetchMeasureReadings()', function () {
    it('should fetch readings from a date', async function () {
      this.timeout(10000);
      const now = new Date().valueOf();
      const { data: readings } = await fetchMeasureReadings(
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
