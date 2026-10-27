import Image from "next/image";
import type { CSSProperties } from "react";
import { images, type ImageKey } from "@/lib/images";
import { photoUrl, type SitePic } from "@/lib/site/photo";
import { Star } from "./Icon";

/**
 * A photo is either a homepage photo key from lib/images.ts ("hero1") or an inner-page photo
 * ({ src: "2026/05/photo.jpg", alt }) from lib/site/data.ts, stored under its WordPress upload path.
 */
export type PicRef = ImageKey | SitePic;

const SITE_PH = "#1B2560"; /* frame colour while an inner-page photo loads */

type PhotoProps = {
  k: PicRef;
  className?: string;
  /** Pass "" for decorative copies of a photo that is already described nearby. */
  alt?: string;
  sizes?: string;
  /** The page's main photo (its Largest Contentful Paint): preloaded and fetched before other images. */
  preload?: boolean;
  /** CSS object-position for inner-page photos, e.g. "50% 20%" to keep faces in a portrait crop. */
  focus?: string;
};

/** A photo in a frame whose background is the photo's average colour while it loads. */
export function Photo({ k, className = "", alt, sizes = "(max-width: 760px) 92vw, 40vw", preload, focus }: PhotoProps) {
  if (typeof k === "string") {
    const im = images[k];
    return (
      <figure className={`ph ${className}`.trim()} style={{ "--ph": im.color } as CSSProperties}>
        <Image
          src={im.src}
          alt={alt ?? im.alt}
          width={im.w}
          height={im.h}
          sizes={sizes}
          preload={preload}
          fetchPriority={preload ? "high" : undefined}
          data-ph=""
        />
      </figure>
    );
  }
  return (
    <figure className={`ph ${className}`.trim()} style={{ "--ph": SITE_PH } as CSSProperties}>
      <Image
        src={photoUrl(k.src)}
        alt={alt ?? k.alt ?? ""}
        fill
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        style={focus ? { objectPosition: focus } : undefined}
        data-ph=""
      />
    </figure>
  );
}

/** The design's "twinkling" photo: a round or framed photo with a sparkle that lights up on hover. */
export function Twinkle({ k, className = "", alt, sizes, focus }: Omit<PhotoProps, "preload">) {
  return (
    <div className={`cn-tw ${className}`.trim()}>
      <Photo k={k} alt={alt} sizes={sizes} focus={focus} />
      <span className="cn-spark" aria-hidden="true">
        <Star className="cn-spark-s" />
      </span>
    </div>
  );
}

/**
 * Picture-slide on hover: a stack of photos that slide one after another while the pointer is over the
 * card (data-fx="slides" in lib/samanvaye/runtime.js; on phones it plays while on screen).
 * Put data-slide-host on the card so hovering anywhere on it plays the photos.
 */
export function PhotoSlides({
  pics,
  className = "",
  sizes = "(max-width: 760px) 92vw, 33vw",
  effect = "push",
  interval = 1300,
}: {
  pics: readonly SitePic[];
  className?: string;
  sizes?: string;
  effect?: "push" | "up" | "fade" | "wipe" | "zoom" | "iris";
  interval?: number;
}) {
  return (
    <div className={`cn-tw ${className}`.trim()}>
      <figure
        className={`ph sl sl-${effect}`}
        data-fx="slides"
        data-mode="auto"
        data-interval={interval}
        style={{ "--ph": SITE_PH } as CSSProperties}
      >
        {pics.map((p, i) => (
          <Image
            key={p.src}
            className={i === 0 ? "sl-i on" : "sl-i"}
            src={photoUrl(p.src)}
            alt={i === 0 ? p.alt ?? "" : ""}
            fill
            sizes={sizes}
            data-ph=""
          />
        ))}
        {pics.length > 1 && (
          <span className="sl-dots" aria-hidden="true">
            {pics.map((p, i) => (
              <i key={p.src} className={i === 0 ? "on" : undefined} />
            ))}
          </span>
        )}
      </figure>
      <span className="cn-spark" aria-hidden="true">
        <Star className="cn-spark-s" />
      </span>
    </div>
  );
}
