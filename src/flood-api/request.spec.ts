import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import { request } from './request';
import type { FloodApiResponse } from './request';
import { RiverDataErrorResponseError } from '../river-data-error-response-error';

describe('src/flood-api/request', function () {
  describe('request()', function () {
    it('should fetch from the correct url', async function () {
      this.timeout(10000);
      const response = <FloodApiResponse<Record<string, unknown>>>(
        await request('/id/stations/3400TH')
      );
      expect(response.data?.items.stationReference).to.equal('3400TH');
    });

    it('should handle a 404 error', async function (done) {
      expect(request('/id/stations/3400THS')).to.be.rejectedWith(
        RiverDataErrorResponseError,
        'Not Found'
      );
      done();
    });
  });
});
