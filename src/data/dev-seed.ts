import { FLIGHT_TEMPLATES } from "@/data/flight-templates";
import { useFlightsStore } from "@/stores/flights-store";
import { getFlightTimes } from "@/utils/flight-time";
import { addDaysISO, todayISO } from "@/utils/flight-time";

/**
 * Dev helper (triggered from the avatar button): seeds the flights shown in
 * the updated reference screenshots — an upcoming AC 856 YYZ->LHR, plus
 * whichever template is airborne *right now* so an IN AIR card is visible.
 */
export function seedDemoFlights() {
  const { addFlight, flights, removeFlight } = useFlightsStore.getState();
  for (const f of [...flights]) removeFlight(f.key);

  const now = Date.now();
  const today = todayISO(now);
  const dates = [addDaysISO(today, -1), today, addDaysISO(today, 1)];

  // 1) Upcoming AC 856 (next departure still ahead).
  const ac856 = FLIGHT_TEMPLATES.find((t) => t.id === "AC856-YYZ-LHR")!;
  const ac856Date =
    dates.find((d) => getFlightTimes(ac856, d).gateDep > now) ?? addDaysISO(today, 1);
  addFlight(ac856.id, ac856Date);

  // 2) An in-air flight on a different city pair, so the split arc is visible.
  outer: for (const template of FLIGHT_TEMPLATES) {
    if (template.operatedAs) continue; // operating flights only
    const samePair =
      (template.from === ac856.from && template.to === ac856.to) ||
      (template.from === ac856.to && template.to === ac856.from);
    if (samePair) continue;
    for (const date of dates) {
      const times = getFlightTimes(template, date);
      if (now > times.takeOff && now < times.land) {
        addFlight(template.id, date);
        break outer;
      }
    }
  }
}
