import { expect } from 'chai';

import * as index from '../../../src/hydrology-api/index';

describe('HydrologyApi', function () {
  it('should only expose the public API', function () {
    expect(Object.keys(index).sort()).to.eql(['createClient', 'fetchReadings']);
  });
});
