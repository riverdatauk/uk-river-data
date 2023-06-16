import { expect } from 'chai';

import { fetchReadings } from '../../../src/hydrology-api/reading';

describe('HydrologyApi readings', function () {
  describe('fetchReadings()', function () {
    it('should fetch readings using criteria', async function () {
      this.timeout(10000);
      const criteria = {
        'station.wiskiID': '3400TH',
      };
      const { data } = await fetchReadings(criteria);
      expect(data).not.to.be.undefined;
      expect(Object.entries(data ?? {}).length).to.equal(7);
    });
  });
});
