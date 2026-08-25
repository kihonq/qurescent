import { useEffect, useState } from "react";

/**
 * False during SSR + first client render; true after mount.
 * Use to defer localStorage-backed UI and avoid hydration flashes.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
