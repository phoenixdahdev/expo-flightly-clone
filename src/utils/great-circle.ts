export type LngLat = [number, number];

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function toVec(p: LngLat): [number, number, number] {
  const lng = toRad(p[0]);
  const lat = toRad(p[1]);
  return [
    Math.cos(lat) * Math.cos(lng),
    Math.cos(lat) * Math.sin(lng),
    Math.sin(lat),
  ];
}

function toLngLat(v: [number, number, number]): LngLat {
  const [x, y, z] = v;
  return [toDeg(Math.atan2(y, x)), toDeg(Math.asin(z / Math.hypot(x, y, z)))];
}

function slerp(from: LngLat, to: LngLat, t: number): LngLat {
  const a = toVec(from);
  const b = toVec(to);
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-9) return from;
  const sinOmega = Math.sin(omega);
  const k0 = Math.sin((1 - t) * omega) / sinOmega;
  const k1 = Math.sin(t * omega) / sinOmega;
  return toLngLat([
    k0 * a[0] + k1 * b[0],
    k0 * a[1] + k1 * b[1],
    k0 * a[2] + k1 * b[2],
  ]);
}

/** Unwrap longitudes so consecutive points never jump across the antimeridian. */
function unwrap(coords: LngLat[]): LngLat[] {
  const out: LngLat[] = [];
  let offset = 0;
  let prev: number | undefined;
  for (const [lng, lat] of coords) {
    let l = lng + offset;
    if (prev !== undefined) {
      while (l - prev > 180) {
        offset -= 360;
        l -= 360;
      }
      while (l - prev < -180) {
        offset += 360;
        l += 360;
      }
    }
    out.push([l, lat]);
    prev = l;
  }
  return out;
}

/** `steps + 1` positions along the great circle from `from` to `to`. */
export function greatCircleCoords(
  from: LngLat,
  to: LngLat,
  steps = 128
): LngLat[] {
  const pts: LngLat[] = [];
  for (let i = 0; i <= steps; i++) pts.push(slerp(from, to, i / steps));
  return unwrap(pts);
}

/** Position and forward bearing at fraction t (0..1) along the great circle. */
export function pointAlongGreatCircle(
  from: LngLat,
  to: LngLat,
  t: number
): { position: LngLat; bearingDeg: number } {
  const clamped = Math.min(1, Math.max(0, t));
  const position = slerp(from, to, clamped);
  const ahead = slerp(from, to, Math.min(1, clamped + 0.01));
  const [lng1, lat1] = position.map(toRad) as [number, number];
  const [lng2, lat2] = ahead.map(toRad) as [number, number];
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  return { position, bearingDeg: (toDeg(Math.atan2(y, x)) + 360) % 360 };
}

export function distanceMiles(from: LngLat, to: LngLat): number {
  const a = toVec(from);
  const b = toVec(to);
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  return Math.acos(dot) * 3958.8;
}

/**
 * GeoJSON LineString features for one flight's route. With `progress` (0..1)
 * the arc splits into 'flown' and 'remaining' segments for in-air rendering.
 */
export function routeFeatures(
  flightId: string,
  from: LngLat,
  to: LngLat,
  progress?: number
): GeoJSON.Feature<GeoJSON.LineString>[] {
  const coords = greatCircleCoords(from, to);
  if (progress === undefined || progress <= 0 || progress >= 1) {
    return [
      {
        type: "Feature",
        properties: { flightId, segment: progress === undefined ? "remaining" : "flown" },
        geometry: { type: "LineString", coordinates: coords },
      },
    ];
  }
  const splitIndex = Math.max(1, Math.min(coords.length - 1, Math.round(progress * (coords.length - 1))));
  return [
    {
      type: "Feature",
      properties: { flightId, segment: "flown" },
      geometry: { type: "LineString", coordinates: coords.slice(0, splitIndex + 1) },
    },
    {
      type: "Feature",
      properties: { flightId, segment: "remaining" },
      geometry: { type: "LineString", coordinates: coords.slice(splitIndex) },
    },
  ];
}

/** Midpoint of the route — used for camera targeting. */
export function routeMidpoint(from: LngLat, to: LngLat): LngLat {
  return slerp(from, to, 0.5);
}

/** Rough zoom level that frames a route of the given length above the sheet. */
export function zoomForDistance(distanceMi: number): number {
  if (distanceMi > 5000) return 1.1;
  if (distanceMi > 2500) return 1.8;
  if (distanceMi > 1200) return 2.6;
  if (distanceMi > 500) return 3.4;
  return 4.2;
}
