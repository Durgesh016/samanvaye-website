import type { CSSProperties } from "react";
import { content } from "@/lib/content";
import { Star } from "../Icon";
import { Twinkle } from "../Photo";

/** "Acts of Love, Seeds of Hope": the photos orbit the title; hovering one pauses the orbit and brings it forward. */
export function Gallery() {
  const g = content.gallery;
  return (
    <section className="cn-sec cn-gallery" aria-labelledby="cn-ga-t">
      <div className="cn-orbit" data-orbit>
        <svg className="cn-orbit-path" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <ellipse cx="500" cy="280" rx="470" ry="250" />
        </svg>
        <div className="cn-head cn-orbit-c">
          <p className="cn-eyebrow">
            <Star />
            <span>{g.eyebrow}</span>
          </p>
          <h2 className="cn-h2" id="cn-ga-t">
            {g.title}
          </h2>
          <p className="cn-lede">{g.text}</p>
        </div>
        <ul className="cn-orb">
          {g.items.map((item, i) => (
            <li className="cn-orb-i" key={item.title} style={{ "--i": i } as CSSProperties}>
              <a className="cn-orb-a cn-host" href={item.href}>
                <Twinkle k={item.img} className="cn-orb-ph" sizes="240px" />
                <span className="cn-orb-cap">
                  <span className="cn-orb-cat">{item.cat}</span>
                  <span className="cn-orb-t">{item.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
