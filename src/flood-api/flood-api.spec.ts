import { expect } from 'chai';

import { RiverDataErrorResponseError } from '../river-data-error-response-error';

import { FloodApi } from './flood-api';

describe('The FloodApi class', function () {
  describe('fetchMeasure()', function () {
    it('should fetch from the correct url', async function () {
      this.timeout(5000);
      const floodApi = new FloodApi();
      const [measure] = await floodApi.fetchMeasure('3400TH-flow--i-15_min-m3_s');
      expect(measure.dto.stationReference).to.equal('3400TH');
    });

    it('should handle a 404 error', async function () {
      this.timeout(5000);
      const floodApi = new FloodApi();
      try {
        await floodApi.fetchMeasure('does-not-exist');
        throw new Error('Should not get here');
      } catch (e) {
        expect(e).to.be.instanceOf(RiverDataErrorResponseError);
        expect((<Error>e).message).to.equal('Not Found');
      }
    });
  });
});
