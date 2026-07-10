import type { Airline } from "@/data/types";

export const AIRLINES: Airline[] = [
  {
    iata: "AC",
    icao: "ACA",
    name: "Air Canada",
    callsign: "AIR CANADA",
    alliance: "Star Alliance",
    brandColor: "#D22630",
    phone: "+1 888 247 2262",
    website: "https://www.aircanada.com",
  },
  {
    iata: "F8",
    icao: "FLE",
    name: "Flair",
    callsign: "FLAIR",
    brandColor: "#0B0B0B",
    phone: "+1 833 711 2333",
    website: "https://www.flyflair.com",
  },
  {
    iata: "GA",
    icao: "GIA",
    name: "Garuda Indonesia",
    callsign: "INDONESIA",
    alliance: "SkyTeam",
    brandColor: "#0D5C63",
    phone: "+62 21 2351 9999",
    website: "https://www.garuda-indonesia.com",
  },
  {
    iata: "KE",
    icao: "KAL",
    name: "Korean Air",
    callsign: "KOREAN AIR",
    alliance: "SkyTeam",
    brandColor: "#05356E",
    phone: "+82 2 2656 2001",
    website: "https://www.koreanair.com",
  },
  {
    iata: "DL",
    icao: "DAL",
    name: "Delta Air Lines",
    callsign: "DELTA",
    alliance: "SkyTeam",
    brandColor: "#C8102E",
    phone: "+1 800 221 1212",
    website: "https://www.delta.com",
  },
  {
    iata: "OZ",
    icao: "AAR",
    name: "Asiana Airlines",
    callsign: "ASIANA",
    alliance: "Star Alliance",
    brandColor: "#B92637",
    phone: "+82 2 2669 8000",
    website: "https://flyasiana.com",
  },
  {
    iata: "AS",
    icao: "ASA",
    name: "Alaska Airlines",
    callsign: "ALASKA",
    alliance: "oneworld",
    brandColor: "#01426A",
    phone: "+1 800 252 7522",
    website: "https://www.alaskaair.com",
  },
  {
    iata: "UA",
    icao: "UAL",
    name: "United",
    callsign: "UNITED",
    alliance: "Star Alliance",
    brandColor: "#002244",
    phone: "+1 800 864 8331",
    website: "https://www.united.com",
  },
  {
    iata: "MF",
    icao: "CXA",
    name: "XiamenAir",
    callsign: "XIAMEN AIR",
    alliance: "SkyTeam",
    brandColor: "#0E6EB8",
    phone: "+86 592 222 6666",
    website: "https://www.xiamenair.com",
  },
];

const byIata = new Map(AIRLINES.map((a) => [a.iata, a]));

export function getAirline(iata: string): Airline {
  const airline = byIata.get(iata);
  if (!airline) throw new Error(`Unknown airline code: ${iata}`);
  return airline;
}
