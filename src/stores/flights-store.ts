import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TrackedFlight } from "@/data/types";

interface FlightsStore {
  flights: TrackedFlight[];
  addFlight(templateId: string, dateISO: string): TrackedFlight;
  removeFlight(key: string): void;
  updateFlight(
    key: string,
    patch: Partial<Pick<TrackedFlight, "bookingCode" | "seat" | "notes">>
  ): void;
}

export const useFlightsStore = create<FlightsStore>()(
  persist(
    (set, get) => ({
      flights: [],
      addFlight: (templateId, dateISO) => {
        const key = `${templateId}_${dateISO}`;
        const existing = get().flights.find((f) => f.key === key);
        if (existing) return existing;
        const flight: TrackedFlight = {
          key,
          templateId,
          dateISO,
          addedAtISO: new Date().toISOString(),
        };
        set((s) => ({ flights: [...s.flights, flight] }));
        return flight;
      },
      removeFlight: (key) =>
        set((s) => ({ flights: s.flights.filter((f) => f.key !== key) })),
      updateFlight: (key, patch) =>
        set((s) => ({
          flights: s.flights.map((f) => (f.key === key ? { ...f, ...patch } : f)),
        })),
    }),
    {
      name: "flighty.flights",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getTrackedFlight(key: string): TrackedFlight | undefined {
  return useFlightsStore.getState().flights.find((f) => f.key === key);
}

if (__DEV__) {
  // Lets dev tooling clear/seed the store from the debugger console.
  (globalThis as Record<string, unknown>).__flightsStore = useFlightsStore;
}
