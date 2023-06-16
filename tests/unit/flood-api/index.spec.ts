import { expect } from 'chai';

import * as index from '../../../src/flood-api/index';

describe('FloodApi', function () {
  it('should only expose the public API', function () {
    expect(Object.keys(index).sort()).to.eql([
      'createClient',
      'fetchMeasure',
      'fetchMeasureReadings',
      'fetchStation',
      'parseMeasureId',
    ]);
  });
});
