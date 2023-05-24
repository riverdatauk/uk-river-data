import { FloodApi } from '../src/';

const parsed = FloodApi.parseMeasureId('asd');

const { unit } = parsed;

console.log(unit.split(''));
