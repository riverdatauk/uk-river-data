import { FloodApiClient } from '../src/';

const parsed = FloodApiClient.parseMeasureId('asd');

const { unit } = parsed;

console.log(unit.split(''));
