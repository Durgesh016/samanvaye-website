import Image from "next/image";
import { content } from "@/lib/content";
import { logo } from "@/lib/images";
import { UiIcon } from "../Icon";
import { NavLinks } from "../site/NavLinks";

type SocialItem = { readonly label: string; readonly icon: string; readonly href: string };

export function SocialLinks({ className = "", items = content.topbar.social }: { className?: string; items?: readonly SocialItem[] }) {
  return (
    <span className={`social ${className}`.trim()}>
      {items.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
          <UiIcon name={s.icon} />
        </a>
      ))}
    </span>
  );
}

/** The logo shows 140–200px wide, so it asks for a file that size, not its full 1100px. */
export function Logo({ eager = false }: { eager?: boolean }) {
  return (
    <Image className="logo" src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} sizes="200px" loading={eager ? "eager" : undefined} />
  );
}

/** Top bar + sticky header with the menu. Every link points inside this site. */
export function SiteHeader() {
  const { topbar, nav, donate } = content;
  return (
    <>
      <div className="topbar cn-topbar">
        <div className="tb-in">
          <a className="tb-mail" href={`mailto:${topbar.email}`}>
            <UiIcon name="mail" />
            <span>{topbar.email}</span>
          </a>
          <span className="tb-loc">
            <UiIcon name="pin" />
            <span>{topbar.location}</span>
          </span>
          <span className="tb-follow">
            <span>{topbar.follow}</span>
            <SocialLinks />
          </span>
        </div>
      </div>

      <header className="cn-header">
        <div className="wrap cn-hd">
          <a className="cn-brand" href={nav[0].href}>
            <Logo eager />
          </a>
          <nav className="cn-nav" aria-label="Main">
            <NavLinks items={nav} />
          </nav>
          <a className="cn-btn cn-donate" href={donate.href}>
            <span>{donate.label}</span>
          </a>
          {/* Mobile menu: a native disclosure, so it works before any JavaScript loads */}
          <details className="menu cn-menu">
            <summary aria-label="Menu">
              <UiIcon name="menu" />
            </summary>
            <nav className="menu-panel" aria-label="Main">
              <NavLinks items={nav} />
              <a className="menu-donate" href={donate.href}>
                {donate.label}
              </a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
