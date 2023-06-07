import { expect } from 'chai';

// import { RiverDataResponseError } from '../../../src/river-data-response-error';

import { HydrologyApiClient } from '../../../src/hydrology-api/hydrology-api-client';

describe('The HydrologyApi class', function () {
  describe('fetchReadings()', function () {
    it('should fetch readings using criteria', async function () {
      this.timeout(10000);
      const api = new HydrologyApiClient();
      const criteria = {
        'station.wiskiID': '3400TH',
      };
      const { data } = await api.fetchReadings(criteria);
      expect(data).not.to.be.undefined;
      expect(Object.entries(data ?? {}).length).to.equal(7);
    });
  });
});
