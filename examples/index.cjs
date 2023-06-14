// eslint-disable-next-line @typescript-eslint/no-var-requires
const { FloodApiClient } = require('../index.cjs');

const parsed = FloodApiClient.parseMeasureId('asd');

const { unit } = parsed;

console.log(unit.split(''));
