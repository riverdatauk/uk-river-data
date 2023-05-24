# UK River Data

> Access level, flow and other data for UK rivers and other watercourses.

## Quick start: browser

Download from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/uk-river-data@0.9"></script>
```

Example usage:

```js
const floodApi = new UkRiverData.FloodApi();
// Get the last 7 days readings from the flow guage at Kingston.
const readings = await floodApi.fetchMeasureReadings(
  '3400TH-flow--i-15_min-m3_s'
  { since: new Date(Date.now() - 86400 * 7)}
);
```

## Quick start: Node JS

Install the package:

```console
$ npm i uk-river-data
```

Example usage:

```js
import { FloodApi } from 'uk-river-data';
const floodApi = new FloodApi();
// Get the last 7 days readings from the flow guage at Kingston.
const readings = await floodApi.fetchMeasureReadings(
  '3400TH-flow--i-15_min-m3_s'
  { since: new Date(Date.now() - 86400 * 7)}
);
```
