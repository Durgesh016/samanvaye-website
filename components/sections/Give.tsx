import Image from "next/image";
import { content } from "@/lib/content";
import { images } from "@/lib/images";
import { Star, UiIcon } from "../Icon";

type GiveData = {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly cta: string;
  readonly href: string;
};

const home = content.donate_cta;
/* the homepage signs the quote "-SUDHA KOMMU President(samanvaye)": name, then role */
const homeGive: GiveData = { ...home, name: home.by.slice(0, home.by.length - home.role.length - 1), role: home.role };

/** The donate call, with the president's portrait rising like a moon. The Causes page passes its own text. */
export function Give({ data = homeGive }: { data?: GiveData }) {
  const d = data;
  const president = images.president;
  return (
    <section className="cn-sec cn-give" aria-labelledby="cn-give-t">
      <div className="cn-moon">
        <span className="cn-moon-disc" aria-hidden="true"></span>
        <Image
          className="cn-pres"
          src={president.src}
          alt={president.alt}
          width={president.w}
          height={president.h}
          sizes="(max-width: 760px) 62vw, 280px"
        />
      </div>
      <figure className="cn-quote">
        <blockquote>
          <p>{d.quote}</p>
        </blockquote>
        <figcaption>
          <span className="cn-by-n">{d.name}</span> <span className="cn-by-r">{d.role}</span>
        </figcaption>
      </figure>
      <div className="cn-head cn-give-copy">
        <p className="cn-eyebrow">
          <Star />
          <span>{d.eyebrow}</span>
        </p>
        <h2 className="cn-h2" id="cn-give-t">
          {d.title}
        </h2>
        <p className="cn-lede">{d.text}</p>
        <a className="cn-btn cn-btn-lg" href={d.href}>
          <span>{d.cta}</span>
          <UiIcon name="arrow-r" />
        </a>
      </div>
    </section>
  );
}
