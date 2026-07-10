import { useEffect } from "react";

import { useUiStore } from "@/stores/ui-store";

/** Mount once at the root: ticks the shared `now` value every 30s. */
export function useNowTicker() {
  useEffect(() => {
    const id = setInterval(() => {
      useUiStore.getState().setNow(Date.now());
    }, 30_000);
    return () => clearInterval(id);
  }, []);
}

/** Subscribe to the shared 30s wall clock. */
export function useNow(): number {
  return useUiStore((s) => s.now);
}

/** `now` quantized to the minute — for values that may feed the map. */
export function useNowMinute(): number {
  return useUiStore((s) => Math.floor(s.now / 60_000) * 60_000);
}
