import { content } from "@/lib/content";
import { Star, UiIcon } from "../Icon";
import { Twinkle } from "../Photo";

export function Events() {
  const e = content.events;
  return (
    <section className="cn-sec cn-events" id="events" aria-labelledby="cn-ev-t">
      <div className="cn-head">
        <p className="cn-eyebrow">
          <Star />
          <span>{e.eyebrow}</span>
        </p>
        <h2 className="cn-h2" id="cn-ev-t">
          {e.title}
        </h2>
        <a className="cn-more" href={e.href}>
          <span>{e.cta}</span>
          <UiIcon name="arrow-r" />
        </a>
      </div>
      <ol className="cn-tl">
        {e.items.map((ev) => (
          <li className="cn-tl-i cn-host" key={ev.title}>
            <span className="cn-tl-node" aria-hidden="true"></span>
            <div className="cn-tl-date">
              <time className="ed cn-ed" dateTime={ev.iso}>
                <span className="ed-d">{ev.day}</span> <span className="ed-m">{ev.month}</span>{" "}
                <span className="ed-y">{ev.year}</span>
              </time>
            </div>
            <div className="cn-card cn-tl-card">
              {/* a 120px square (88px on phones) cropped from a wide photo needs about 1.8× that width */}
              <Twinkle k={ev.img} className="cn-tl-ph" sizes="(max-width: 760px) 160px, 220px" />
              <div className="cn-tl-body">
                <h3 className="cn-h4">{ev.title}</h3>
                <p>{ev.text}</p>
                <a className="cn-more" href={ev.href}>
                  <span>{ev.cta}</span>
                  <UiIcon name="arrow-r" />
                  <span className="vh"> {ev.title}</span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
