import type { Airport } from "@/data/types";

export const AIRPORTS: Airport[] = [
  {
    iata: "CGK",
    icao: "WIII",
    name: "Soekarno-Hatta Intl",
    city: "Jakarta",
    countryCode: "ID",
    lngLat: [106.6559, -6.1256],
    tzOffsetMinutes: 420,
  },
  {
    iata: "ICN",
    icao: "RKSI",
    name: "Incheon Intl",
    city: "Seoul",
    countryCode: "KR",
    lngLat: [126.4505, 37.4602],
    tzOffsetMinutes: 540,
  },
  {
    iata: "SFO",
    icao: "KSFO",
    name: "San Francisco Intl",
    city: "San Francisco",
    countryCode: "US",
    lngLat: [-122.379, 37.6213],
    tzOffsetMinutes: -420,
  },
  {
    iata: "JFK",
    icao: "KJFK",
    name: "John F Kennedy Intl.",
    city: "New York",
    countryCode: "US",
    lngLat: [-73.7781, 40.6413],
    tzOffsetMinutes: -240,
  },
  {
    iata: "LHR",
    icao: "EGLL",
    name: "Heathrow",
    city: "London",
    countryCode: "GB",
    lngLat: [-0.4543, 51.47],
    tzOffsetMinutes: 60,
  },
  {
    iata: "MNL",
    icao: "RPLL",
    name: "Ninoy Aquino Intl",
    city: "Manila",
    countryCode: "PH",
    lngLat: [121.0198, 14.5086],
    tzOffsetMinutes: 480,
  },
  {
    iata: "HLP",
    icao: "WIHH",
    name: "Halim Perdanakusuma Intl",
    city: "Jakarta",
    countryCode: "ID",
    lngLat: [106.8905, -6.2665],
    tzOffsetMinutes: 420,
  },
  {
    iata: "BKS",
    icao: "WIPL",
    name: "Fatmawati Soekarno",
    city: "Bengkulu",
    countryCode: "ID",
    lngLat: [102.339, -3.8637],
    tzOffsetMinutes: 420,
  },
  {
    iata: "",
    icao: "WIIA",
    name: "Budiarto",
    city: "Tangerang",
    countryCode: "ID",
    lngLat: [106.57, -6.293],
    tzOffsetMinutes: 420,
  },
  {
    iata: "PCB",
    icao: "WIHP",
    name: "Pondok Cabe Airport",
    city: "Pondok Cabe",
    countryCode: "ID",
    lngLat: [106.7647, -6.3369],
    tzOffsetMinutes: 420,
  },
  {
    iata: "SOE",
    icao: "FCOS",
    name: "Souanke",
    city: "Souanke",
    countryCode: "CG",
    lngLat: [14.133, 2.067],
    tzOffsetMinutes: 60,
  },
  {
    iata: "",
    icao: "EDLZ",
    name: "Bad Sassendorf",
    city: "Soest",
    countryCode: "DE",
    lngLat: [8.189, 51.575],
    tzOffsetMinutes: 120,
  },
  {
    iata: "UTC",
    icao: "EHSB",
    name: "Soesterberg Air Base",
    city: "Utrecht",
    countryCode: "NL",
    lngLat: [5.2764, 52.1273],
    tzOffsetMinutes: 120,
  },
  {
    iata: "YYZ",
    icao: "CYYZ",
    name: "Lester B. Pearson Intl.",
    city: "Toronto",
    countryCode: "CA",
    lngLat: [-79.6248, 43.6777],
    tzOffsetMinutes: -240,
  },
  {
    iata: "YVR",
    icao: "CYVR",
    name: "Vancouver Intl.",
    city: "Vancouver",
    countryCode: "CA",
    lngLat: [-123.1815, 49.1951],
    tzOffsetMinutes: -420,
  },
  {
    iata: "HND",
    icao: "RJTT",
    name: "Haneda",
    city: "Tokyo",
    countryCode: "JP",
    lngLat: [139.7798, 35.5494],
    tzOffsetMinutes: 540,
  },
  {
    iata: "BKK",
    icao: "VTBS",
    name: "Suvarnabhumi",
    city: "Bangkok",
    countryCode: "TH",
    lngLat: [100.7501, 13.69],
    tzOffsetMinutes: 420,
  },
];

const byIata = new Map(AIRPORTS.filter((a) => a.iata).map((a) => [a.iata, a]));
const byIcao = new Map(AIRPORTS.map((a) => [a.icao, a]));

export function getAirport(code: string): Airport {
  const airport = byIata.get(code) ?? byIcao.get(code);
  if (!airport) throw new Error(`Unknown airport code: ${code}`);
  return airport;
}

export function flagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}
