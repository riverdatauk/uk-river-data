import { expect } from 'chai';

import { RiverDataError } from './river-data-error';

describe('class RiverDataError', function () {
  it('should have the right name', function () {
    const err = new RiverDataError('Something bad');
    expect(err.name).to.equal('RiverDataError');
    expect(err.message).to.equal('Something bad');
    expect(err.info).to.eql({});
  });

  it('should have the right info', function () {
    const err = new RiverDataError('Something bad', { happened: 'now' });
    expect(err.info).to.eql({ happened: 'now' });
  });
});
