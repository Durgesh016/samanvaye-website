"use client";

import { usePathname } from "next/navigation";

type NavItem = { readonly label: string; readonly href: string };

/** Which menu item a page belongs to (blog posts live at the site root, like on samanvaye.org). */
function sectionOf(path: string, items: readonly NavItem[]): string | null {
  const p = path.replace(/\/+$/, "") || "/";
  if (items.some((n) => n.href === p)) return p;
  if (p === "/vayo-vidhya") return "/causes";
  if (p === "/donation") return null;
  return p.split("/").length === 2 ? "/blogs" : null;
}

/** The menu links; the current page's link is marked (aria-current) so it lights up. */
export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const current = sectionOf(usePathname() || "/", items);
  return (
    <>
      {items.map((n) => (
        <a key={n.label} href={n.href} aria-current={n.href === current ? "page" : undefined}>
          {n.label}
        </a>
      ))}
    </>
  );
}
