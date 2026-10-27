"use client";

import { useEffect } from "react";

type Runtime = { start: () => void; start3d: () => void };
type Connection = { saveData?: boolean; effectiveType?: string };

/** The visitor turned on Data Saver, or is on a 2G connection. */
function savingData() {
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  return !!c && (c.saveData === true || /2g$/.test(c.effectiveType ?? ""));
}

/** Resolves after the load event, at the browser's next quiet moment. */
function afterLoad() {
  return new Promise<void>((resolve) => {
    const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 300));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

/**
 * Starts everything that needs the browser, once the page is on screen:
 *  - the starfield, counters, marquees, line drawing, tilt and picture-slide hover effects (every page)
 *  - A-Frame (npm package) and the 3D photo constellation, only on pages with a [data-stage] (the homepage).
 *    The 1.3 MB library loads after the page itself, so it never holds up the text, photos or effects; until
 *    then, and for visitors saving data, the hero shows its still picture.
 * Pages are fully readable without this; it only adds motion and 3D. Links are plain <a> tags, so every
 * page load starts these effects fresh.
 */
export function SiteEffects() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await import("@/lib/samanvaye/textures");
      await import("@/lib/samanvaye/runtime");
      await import("@/lib/samanvaye/constellation-scene");
      if (cancelled) return;
      const SV = (window as unknown as { SV: Runtime }).SV;
      SV.start();
      if (!document.querySelector("[data-stage]") || savingData()) return;
      await afterLoad();
      try {
        const aframe = await import("aframe");
        const w = window as unknown as { AFRAME?: unknown };
        if (!w.AFRAME) w.AFRAME = (aframe as { default?: unknown }).default ?? aframe;
      } catch (err) {
        console.warn("[Samanvaye] A-Frame could not load; the hero keeps its still picture.", err);
      }
      if (!cancelled) SV.start3d();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
