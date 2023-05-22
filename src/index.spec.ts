import { expect } from 'chai';

import * as index from './index';
import { version } from '../package.json';

describe('The UkRiverData entry point', function () {
  it('should only expose the public entry point', function () {
    expect(Object.keys(index).sort()).to.eql(['version']);
  });
  it('should have the right version', function () {
    expect(index.version).to.equal(version);
  });
});
