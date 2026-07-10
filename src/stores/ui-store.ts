import { create } from "zustand";

import type { MapStyleKey } from "@/constants/map-styles";

interface UiStore {
  /** Wall-clock ticker (ms). Updated every 30s by a single interval. */
  now: number;
  mapStyle: MapStyleKey;
  /** TrackedFlight key currently open in the detail sheet, if any. */
  selectedFlightKey: string | null;
  setNow(now: number): void;
  toggleMapStyle(): void;
  setSelectedFlightKey(key: string | null): void;
}

export const useUiStore = create<UiStore>()((set) => ({
  now: Date.now(),
  mapStyle: "satellite",
  selectedFlightKey: null,
  setNow: (now) => set({ now }),
  toggleMapStyle: () =>
    set((s) => ({ mapStyle: s.mapStyle === "satellite" ? "standard" : "satellite" })),
  setSelectedFlightKey: (key) => set({ selectedFlightKey: key }),
}));
