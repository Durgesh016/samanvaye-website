import { Fragment } from "react";
import { content } from "@/lib/content";
import { Star } from "../Icon";

/** Endless ribbon of words (Medical · Education · …); the effect script duplicates the track for a seamless loop. */
export function Marquee({ words = content.marquee }: { words?: readonly string[] }) {
  return (
    <div className="cn-mqband">
      <div className="mq cn-mq" data-fx="marquee">
        <div className="mq-track">
          {words.map((word) => (
            <Fragment key={word}>
              <span className="mq-item">{word}</span>
              <span className="mq-sep" aria-hidden="true">
                <Star className="cn-mq-s" />
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
