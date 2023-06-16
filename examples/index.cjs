// eslint-disable-next-line @typescript-eslint/no-var-requires
const { FloodApi } = require('../index.cjs');

const parsed = FloodApi.parseMeasureId('asd');

const { unit } = parsed;

console.log(unit.split(''));
