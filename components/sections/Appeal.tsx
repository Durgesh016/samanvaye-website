import { content } from "@/lib/content";
import { Twinkle } from "../Photo";

export function Appeal() {
  const a = content.appeal;
  return (
    <section className="cn-sec cn-appeal" aria-labelledby="cn-ap-t">
      <div className="cn-head">
        <h2 className="cn-h2" id="cn-ap-t">
          {a.title}
        </h2>
        <p className="cn-lede">{a.text}</p>
        <a className="cn-btn cn-btn-ghost" href={a.href}>
          <span className="cn-heart" aria-hidden="true">
            {a.cta.slice(0, 1)}
          </span>{" "}
          <span>{a.cta.slice(2)}</span>
        </a>
      </div>
      <ul className="cn-ap">
        {a.cards.map((card) => (
          <li key={card.title}>
            <a className="cn-ap-card cn-host" href={a.href}>
              <Twinkle k={card.img} className="cn-round" sizes="220px" />
              <h3 className="cn-h4">{card.title}</h3>
              <p>{card.text}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
