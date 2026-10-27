import { content } from "@/lib/content";
import { Icon, Star } from "../Icon";

export function Programmes() {
  const p = content.programmes;
  return (
    <section className="cn-sec cn-prog" aria-labelledby="cn-prog-t">
      <div className="cn-head">
        <p className="cn-eyebrow">
          <Star />
          <span>{p.eyebrow}</span>
        </p>
        <h2 className="cn-h2 cn-caps" id="cn-prog-t">
          {p.title}
        </h2>
      </div>
      <ul className="cn-pg">
        {p.items.map((item) => (
          <li className="cn-pg-i" key={item.title}>
            <span className="cn-ico cn-ico-lg">
              <Icon name={item.icon} />
            </span>
            <h3 className="cn-h4">{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
