/**
 * A station.
 */
export interface FloodApiStation {
  api: 'flood';
  id: string;
  dto: FloodApiStationDto;
}

/**
 * A station data transfer object.
 */
export interface FloodApiStationDto {
  '@id': string;
}

/**
 * Parse a measure ID from the EA Flood Monitoring API.
 *
 * @param url The url of a measure (any path will be stripped).
 */
export const parseStationDto = (dto: FloodApiStationDto): FloodApiStation => {
  // Strip the path from the id.
  const id = dto['@id'].slice(dto['@id'].lastIndexOf('/') + 1);

  return {
    id,
    api: 'flood',
    dto,
  };
};
