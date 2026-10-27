import type { ReactNode } from "react";

/** Line icons on a 24×24 grid; they inherit the text colour. */
const paths: Record<string, ReactNode> = {
  book: (
    <>
      <path d="M3 5.6c2.6-1 5.6-.9 9 1.2 3.4-2.1 6.4-2.2 9-1.2v12.8c-2.6-1-5.6-.9-9 1.2-3.4-2.1-6.4-2.2-9-1.2z" />
      <path d="M12 6.8v12.8" />
    </>
  ),
  pulse: (
    <>
      <path d="M19.7 13.1C17.5 16.4 12 20 12 20s-8.6-5.6-8.6-11.2A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8.6 2.2" />
      <path d="M13.6 13h2.1l1.4-2.6L19 15l1.2-2H22" />
    </>
  ),
  rise: (
    <>
      <circle cx="12" cy="4.6" r="2" />
      <path d="M12 8.4v6.1" />
      <path d="M12 14.5 9 21" />
      <path d="m12 14.5 3 6.5" />
      <path d="m7.8 11.4 4.2-2.7 4.6-4.5" />
    </>
  ),
  hand: (
    <>
      <path d="M12 11s-3.4-2-3.4-4.3A1.9 1.9 0 0 1 12 5.6a1.9 1.9 0 0 1 3.4 1.1C15.4 9 12 11 12 11z" />
      <path d="M2.5 14.5H6l3 2.2h3.6a1.6 1.6 0 0 1 0 3.2H8.5" />
      <path d="M12.6 19.9h2.2l5.6-4.2a1.5 1.5 0 0 0-1.9-2.3l-3.1 2.1" />
    </>
  ),
  homes: (
    <>
      <path d="M2.5 20.5h19" />
      <path d="M4 20.5v-8.2L9 8l5 4.3v8.2" />
      <path d="M14 20.5v-5.6l3.5-3 3.5 3v5.6" />
      <path d="M7.6 20.5v-4.2h2.8v4.2" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c.2-3.9 2.7-6.4 7-6.6-.1 4-2.8 6.6-7 6.6z" />
      <path d="M12 14.5c-.2-3.2-2.4-5.3-6-5.4.1 3.3 2.4 5.4 6 5.4z" />
      <path d="M8 21h8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.6c0 4.6 3.1 8 7.5 9.4 4.4-1.4 7.5-4.8 7.5-9.4V6z" />
      <path d="m8.6 12.1 2.4 2.4 4.6-4.8" />
    </>
  ),
  heart: <path d="M12 20s-8.5-5.4-8.5-11A4.7 4.7 0 0 1 12 6.7 4.7 4.7 0 0 1 20.5 9c0 5.6-8.5 11-8.5 11z" />,
  "arrow-r": (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  ig: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r=".7" fill="currentColor" />
    </>
  ),
  yt: (
    <>
      <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="4" />
      <path d="m10.2 9.2 4.8 2.8-4.8 2.8z" fill="currentColor" />
    </>
  ),
  fb: <path d="M14.5 21v-7.6h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8.8v3h2.6V21" />,
  phone: (
    <path d="M8.6 3.5H6A2.3 2.3 0 0 0 3.7 6 15.8 15.8 0 0 0 18 20.3a2.3 2.3 0 0 0 2.5-2.3v-2.6l-4-1.6-1.9 1.9a12.3 12.3 0 0 1-6.3-6.3l1.9-1.9z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 6.5 8.2 6.3 8.2-6.3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.2s-6.6-6-6.6-11.1a6.6 6.6 0 0 1 13.2 0c0 5.1-6.6 11.1-6.6 11.1z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  /* used by the inner pages */
  "arrow-l": (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  "chev-l": <path d="m15 6-6 6 6 6" />,
  "chev-r": <path d="m9 6 6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.6-3.9 3.4-6.2 7.2-6.2s6.6 2.3 7.2 6.2" />
    </>
  ),
  comment: <path d="M4 5.5h16v10.5H9.5L5.5 19.5V16H4z" />,
  quote: (
    <path d="M10 7.5C6.8 8.3 5 10.6 5 14v3.5h5V13H7.4c.2-1.9 1.2-3 2.9-3.6zM19 7.5c-3.2.8-5 3.1-5 6.5v3.5h5V13h-2.6c.2-1.9 1.2-3 2.9-3.6z" />
  ),
  clinic: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M12 8.2v7.6M8.2 12h7.6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.4-3.6 2.8-5.6 6-5.6s5.6 2 6 5.6" />
      <path d="M15.5 4.9a3.2 3.2 0 0 1 0 6.2M17.5 14.6c2 .6 3.3 2.4 3.5 5.4" />
    </>
  ),
  look: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  zoom: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.4 15.4 5.1 5.1M10.5 7.8v5.4M7.8 10.5h5.4" />
    </>
  ),
  drag: <path d="M8 12h8M5 9l-3 3 3 3M19 9l3 3-3 3" />,
  wa: (
    <>
      <path d="M4.2 19.8 5.3 16A8.4 8.4 0 1 1 8.4 19z" />
      <path d="M9 8.6c0 3.4 2.9 6.3 6.3 6.4l1.2-1.4-1.9-1-1 .9a4.5 4.5 0 0 1-2.3-2.3l.9-1-1-1.9z" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5 12 4l9 5.5z" />
      <path d="M5 10v7.5M9.7 10v7.5M14.3 10v7.5M19 10v7.5M3 20h18" />
    </>
  ),
};

export type IconName = keyof typeof paths;

/** Small inline icon that sits beside text. */
export function UiIcon({ name }: { name: string }) {
  return (
    <svg className={`i i-${name}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

/** Larger icon that fills its box (programme and feature icons). */
export function Icon({ name }: { name: string }) {
  return (
    <svg className={`ic ic-${name}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

/** Four-point star used as the design's motif. */
export function Star({ className = "cn-star" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" />
    </svg>
  );
}
