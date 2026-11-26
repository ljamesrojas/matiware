import { useEffect, useState } from "react";

/**
 * Tiny hash router. Hash routes keep working with the relative `base: "./"` build,
 * on Netlify without redirect rules, and offline from the PWA cache.
 *
 *   #/                    landing page (also any other hash, e.g. #devices)
 *   #/explore             explorer, current device
 *   #/explore/<deviceId>  explorer, opened on that device
 */
export type Route = { view: "landing" } | { view: "explore"; deviceId?: string };

export function parseHash(hash: string): Route {
  const match = hash.match(/^#\/explore(?:\/([\w-]+))?\/?$/);
  return match ? { view: "explore", deviceId: match[1] } : { view: "landing" };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export const homeHref = "#/";

export function exploreHref(deviceId?: string): string {
  return deviceId ? `#/explore/${deviceId}` : "#/explore";
}
