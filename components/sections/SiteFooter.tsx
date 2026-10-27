import { content } from "@/lib/content";
import { Logo, SocialLinks } from "./SiteHeader";

export function SiteFooter() {
  const f = content.footer;
  return (
    <footer className="cn-footer">
      <div className="wrap">
        <div className="cn-ft-top">
          <Logo />
          <p>{f.text}</p>
          <SocialLinks className="cn-social" />
        </div>
        <div className="cn-ft-cols">
          <nav aria-labelledby="cn-ft-q">
            <h2 className="cn-ft-h" id="cn-ft-q">
              {f.quick_title}
            </h2>
            <ul>
              {f.quick.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="cn-ft-s">
            <h2 className="cn-ft-h" id="cn-ft-s">
              {f.services_title}
            </h2>
            <ul>
              {f.services.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="cn-ft-reach">
            <h2 className="cn-ft-h">{f.reach_title}</h2>
            <dl>
              <div>
                <dt>{f.emergency_label}</dt>
                <dd>
                  {f.phones.map((p) => (
                    <a key={p.label} href={p.href}>
                      {p.label}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{f.email_label}</dt>
                <dd>
                  <a href={`mailto:${f.email}`}>{f.email}</a>
                </dd>
              </div>
              <div>
                <dt>{f.address_label}</dt>
                <dd>{f.address}</dd>
              </div>
            </dl>
          </div>
        </div>
        <p className="cn-copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
